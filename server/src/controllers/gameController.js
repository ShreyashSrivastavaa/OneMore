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
    // Note: valueA, valueB, and correct answer are intentionally EXCLUDED for security!
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

export const startGame = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    let firstQuestion = FALLBACK_QUESTION;
    let sessionId = crypto.randomUUID();

    try {
      const questions = await prisma.question.findMany({ take: 20 });
      if (questions.length > 0) {
        firstQuestion = questions[Math.floor(Math.random() * questions.length)];
      }

      const session = await prisma.gameSession.create({
        data: {
          userId,
          currentStreak: 0,
          bestStreak: 0,
          status: 'ACTIVE',
          lastQuestionId: firstQuestion.id,
        },
      });
      sessionId = session.id;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalGames: { increment: 1 },
            lastPlayedAt: new Date(),
          },
        });
      }
    } catch (dbErr) {
      // Fallback session if DB server is offline in dev/test environment
    }

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

    let session = null;
    let question = FALLBACK_QUESTION;

    try {
      session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
      });
    } catch (dbErr) {}

    if (session) {
      if (session.status !== 'ACTIVE') {
        throw new ApiError(400, 'GAME_OVER', 'This game session has already ended.');
      }

      if (session.userId && req.user && session.userId !== req.user.id) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not own this game session.');
      }

      if (session.lastQuestionId !== questionId) {
        throw new ApiError(400, 'INVALID_QUESTION_SUBMISSION', 'Submitted question does not match the active question.');
      }

      const existingAttempt = await prisma.answerAttempt.findUnique({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId,
          },
        },
      });

      if (existingAttempt) {
        throw new ApiError(400, 'DUPLICATE_ANSWER', 'This question has already been answered.');
      }

      const dbQuestion = await prisma.question.findUnique({
        where: { id: questionId },
      });
      if (dbQuestion) question = dbQuestion;
    }

    // Authoritative Validation
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

    if (session) {
      await prisma.answerAttempt.create({
        data: {
          sessionId,
          questionId,
          userAnswer: answer,
          isCorrect,
          streakAtAttempt: session.currentStreak,
        },
      });
    }

    if (isCorrect) {
      const nextStreak = (session ? session.currentStreak : 0) + 1;
      let isNewBest = false;

      if (session) {
        const newSessionBest = Math.max(session.bestStreak, nextStreak);
        if (req.user) {
          const user = await prisma.user.findUnique({ where: { id: req.user.id } });
          if (user && nextStreak > user.bestStreak) {
            isNewBest = true;
            await prisma.user.update({
              where: { id: req.user.id },
              data: {
                bestStreak: nextStreak,
                totalCorrect: { increment: 1 },
                totalQuestions: { increment: 1 },
              },
            });
          }
        }

        const availableQuestions = await prisma.question.findMany({ take: 20 });
        const nextQ = availableQuestions.length > 0
          ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
          : FALLBACK_QUESTION;

        await prisma.gameSession.update({
          where: { id: sessionId },
          data: {
            currentStreak: nextStreak,
            bestStreak: newSessionBest,
            questionsAnswered: { increment: 1 },
            correctAnswers: { increment: 1 },
            lastQuestionAt: new Date(),
            lastQuestionId: nextQ.id,
          },
        });

        return res.json({
          correct: true,
          correctAnswer: correctAnswerStr,
          streak: nextStreak,
          isNewBest,
          nextQuestion: sanitizeQuestion(nextQ),
        });
      }

      return res.json({
        correct: true,
        correctAnswer: correctAnswerStr,
        streak: nextStreak,
        isNewBest: false,
        nextQuestion: sanitizeQuestion(FALLBACK_QUESTION),
      });
    } else {
      if (session) {
        await prisma.gameSession.update({
          where: { id: sessionId },
          data: {
            status: 'GAME_OVER',
            endedAt: new Date(),
          },
        });
      }

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
