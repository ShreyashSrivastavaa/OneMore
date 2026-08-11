import prisma from '../config/db.js';
import { ApiError } from '../utils/errors.js';
import { z } from 'zod';
import crypto from 'crypto';

const answerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  answer: z.enum(['OVER', 'UNDER', 'A', 'B']),
});

const sanitizeQuestion = (q) => {
  if (!q) return null;
  return {
    id: q.id,
    category: q.category,
    formatType: q.formatType,
    metric: q.metric,
    entityA: q.entityA,
    entityB: q.entityB,
    displayA: q.displayA,
    displayB: q.displayB,
    prompt: q.prompt,
    dataAsOf: q.dataAsOf,
    // Note: valueA, valueB, and correct answer are intentionally EXCLUDED for anti-cheat security!
  };
};

const FALLBACK_QUESTION = {
  id: 'q_fallback_001',
  category: 'YouTube',
  formatType: 'PICK_WINNER',
  metric: 'YouTube Subscribers',
  entityA: 'MrBeast',
  entityB: 'T-Series',
  valueA: 310000000,
  valueB: 270000000,
  displayA: '310 Million',
  displayB: '270 Million',
  prompt: 'Who has MORE YouTube subscribers?',
  dataAsOf: 'August 2026',
};

// Sub-millisecond In-Memory Caches
let questionsList = [];
const questionsMap = new Map();
const activeSessions = new Map();

// Populate in-memory question cache from database
const initQuestionsCache = async () => {
  if (questionsList.length > 0) return;
  try {
    const dbQuestions = await prisma.question.findMany({ take: 2000 });
    if (dbQuestions && dbQuestions.length > 0) {
      questionsList = dbQuestions;
      dbQuestions.forEach((q) => questionsMap.set(q.id, q));
    }
  } catch (err) {}
};

export const startGame = async (req, res, next) => {
  try {
    await initQuestionsCache();

    const userId = req.user ? req.user.id : null;
    const pool = questionsList.length > 0 ? questionsList : [FALLBACK_QUESTION];
    const firstQuestion = pool[Math.floor(Math.random() * pool.length)];
    const sessionId = crypto.randomUUID();

    const sessionData = {
      id: sessionId,
      userId,
      currentStreak: 0,
      bestStreak: 0,
      status: 'ACTIVE',
      lastQuestionId: firstQuestion.id,
      answeredIds: new Set([firstQuestion.id]),
    };

    // Store in ultra-fast RAM cache
    activeSessions.set(sessionId, sessionData);

    // Asynchronously persist session to database in background
    (async () => {
      try {
        await prisma.gameSession.create({
          data: {
            id: sessionId,
            userId,
            currentStreak: 0,
            bestStreak: 0,
            status: 'ACTIVE',
            lastQuestionId: firstQuestion.id,
          },
        });
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { totalGames: { increment: 1 }, lastPlayedAt: new Date() },
          });
        }
      } catch (e) {}
    })();

    return res.json({
      sessionId,
      streak: 0,
      question: sanitizeQuestion(firstQuestion),
    });
  } catch (err) {
    return next(err);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const parseResult = answerSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ApiError(400, 'INVALID_INPUT', 'Invalid session or answer payload.');
    }

    const { sessionId, questionId, answer } = parseResult.data;

    // Fast sub-1ms session lookup
    let session = activeSessions.get(sessionId);
    if (!session) {
      // Fallback to database if server restarted mid-game
      try {
        const dbSession = await prisma.gameSession.findUnique({ where: { id: sessionId } });
        if (dbSession) {
          session = {
            id: dbSession.id,
            userId: dbSession.userId,
            currentStreak: dbSession.currentStreak,
            bestStreak: dbSession.bestStreak,
            status: dbSession.status,
            lastQuestionId: dbSession.lastQuestionId,
            answeredIds: new Set([dbSession.lastQuestionId]),
          };
          activeSessions.set(sessionId, session);
        }
      } catch (e) {}
    }

    if (session && session.status !== 'ACTIVE') {
      throw new ApiError(400, 'GAME_OVER', 'This game session has already ended.');
    }

    // Fast question lookup
    await initQuestionsCache();
    let question = questionsMap.get(questionId) || FALLBACK_QUESTION;

    // Server-Authoritative Evaluation (< 0.1ms)
    let isCorrect = false;
    let correctAnswerStr = 'A';

    if (question.formatType === 'PICK_WINNER') {
      const aIsBigger = question.valueA >= (question.valueB || 0);
      correctAnswerStr = aIsBigger ? 'A' : 'B';
      isCorrect = answer === correctAnswerStr;
    } else if (question.formatType === 'TIMELINE') {
      const aIsEarlier = question.valueA <= (question.valueB || 0);
      correctAnswerStr = aIsEarlier ? 'A' : 'B';
      isCorrect = answer === correctAnswerStr;
    } else if (question.formatType === 'OVER_UNDER') {
      const targetDisplayVal = parseFloat(question.prompt.match(/[\d.]+/)?.[0] || '0');
      const isOver = question.valueA >= targetDisplayVal;
      correctAnswerStr = isOver ? 'OVER' : 'UNDER';
      isCorrect = answer === correctAnswerStr;
    }

    if (isCorrect) {
      const currentStreak = session ? session.currentStreak + 1 : 1;
      let isNewBest = false;

      if (session) {
        session.currentStreak = currentStreak;
        if (currentStreak > session.bestStreak) {
          session.bestStreak = currentStreak;
        }
      }

      // Pick Next Question instantly from RAM pool
      const pool = questionsList.length > 0 ? questionsList : [FALLBACK_QUESTION];
      const available = pool.filter((q) => !session || !session.answeredIds.has(q.id));
      const nextQ = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : pool[Math.floor(Math.random() * pool.length)];

      if (session) {
        session.lastQuestionId = nextQ.id;
        session.answeredIds.add(nextQ.id);
      }

      // Async Non-Blocking Database Persist
      (async () => {
        try {
          if (session) {
            await prisma.gameSession.update({
              where: { id: sessionId },
              data: {
                currentStreak,
                bestStreak: session.bestStreak,
                lastQuestionId: nextQ.id,
              },
            });
            if (req.user) {
              const user = await prisma.user.findUnique({ where: { id: req.user.id } });
              if (user && currentStreak > user.bestStreak) {
                isNewBest = true;
                await prisma.user.update({
                  where: { id: req.user.id },
                  data: { bestStreak: currentStreak, totalCorrect: { increment: 1 } },
                });
              } else if (user) {
                await prisma.user.update({
                  where: { id: req.user.id },
                  data: { totalCorrect: { increment: 1 } },
                });
              }
            }
          }
        } catch (e) {}
      })();

      return res.json({
        correct: true,
        correctAnswer: correctAnswerStr,
        streak: currentStreak,
        isNewBest,
        nextQuestion: sanitizeQuestion(nextQ),
      });
    } else {
      if (session) {
        session.status = 'GAME_OVER';
      }

      (async () => {
        try {
          if (session) {
            await prisma.gameSession.update({
              where: { id: sessionId },
              data: { status: 'GAME_OVER', endedAt: new Date() },
            });
          }
        } catch (e) {}
      })();

      return res.json({
        correct: false,
        correctAnswer: correctAnswerStr,
        streak: session ? session.currentStreak : 0,
        isNewBest: false,
        nextQuestion: null,
      });
    }
  } catch (err) {
    return next(err);
  }
};
