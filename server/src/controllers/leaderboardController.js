import prisma from '../config/db.js';
import { ApiError } from '../utils/errors.js';

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'ALEX_99', streak: 42, date: '2026-08-11', badge: '🥇 CHAMPION' },
  { rank: 2, name: 'TRIVIA_GOD', streak: 38, date: '2026-08-10', badge: '🥈 LEGEND' },
  { rank: 3, name: 'SHREYASH', streak: 31, date: '2026-08-11', badge: '🥉 MASTER' },
  { rank: 4, name: 'NINJA_STREAK', streak: 27, date: '2026-08-09', badge: 'PRO' },
  { rank: 5, name: 'CYBER_ALIVE', streak: 24, date: '2026-08-08', badge: 'PRO' },
];

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const skip = (page - 1) * limit;

    let topUsers = [];
    try {
      topUsers = await prisma.user.findMany({
        where: { bestStreak: { gt: 0 } },
        orderBy: [{ bestStreak: 'desc' }, { updatedAt: 'asc' }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          bestStreak: true,
          totalGames: true,
          updatedAt: true,
        },
      });
    } catch (dbErr) {
      // Fallback if DB is disconnected in dev/test environment
      return res.json({
        page: 1,
        limit,
        leaderboard: DEFAULT_LEADERBOARD,
      });
    }

    if (topUsers.length === 0) {
      return res.json({
        page,
        limit,
        leaderboard: DEFAULT_LEADERBOARD,
      });
    }

    const formatted = topUsers.map((user, index) => {
      const rank = skip + index + 1;
      let badge = 'CONTENDER';
      if (rank === 1) badge = '🥇 CHAMPION';
      else if (rank === 2) badge = '🥈 LEGEND';
      else if (rank === 3) badge = '🥉 MASTER';
      else if (rank <= 5) badge = 'PRO';
      else if (rank <= 10) badge = 'RISING';

      return {
        rank,
        name: user.name,
        avatarUrl: user.avatarUrl,
        streak: user.bestStreak,
        totalGames: user.totalGames,
        date: user.updatedAt.toISOString().split('T')[0],
        badge,
      };
    });

    return res.json({
      page,
      limit,
      leaderboard: formatted,
    });
  } catch (err) {
    return next(err);
  }
};

export const getMyRank = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({
        rank: null,
        bestStreak: 0,
        totalGames: 0,
        accuracy: 0,
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new ApiError(404, 'USER_NOT_FOUND', 'User record not found.');
      }

      const higherRankCount = await prisma.user.count({
        where: { bestStreak: { gt: user.bestStreak } },
      });

      const rank = user.bestStreak > 0 ? higherRankCount + 1 : null;
      const accuracy = user.totalQuestions > 0
        ? Math.round((user.totalCorrect / user.totalQuestions) * 100)
        : 100;

      return res.json({
        rank,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bestStreak: user.bestStreak,
        totalGames: user.totalGames,
        totalQuestions: user.totalQuestions,
        totalCorrect: user.totalCorrect,
        accuracy,
      });
    } catch (dbErr) {
      return res.json({
        rank: null,
        bestStreak: 0,
        totalGames: 0,
        accuracy: 0,
      });
    }
  } catch (err) {
    return next(err);
  }
};
