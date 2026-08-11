import prisma from '../config/db.js';
import { ApiError } from '../utils/errors.js';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(30).optional(),
});

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        oauthAccounts: {
          select: {
            provider: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User profile not found.');
    }

    const higherRankCount = await prisma.user.count({
      where: {
        bestStreak: { gt: user.bestStreak },
      },
    });

    const rank = user.bestStreak > 0 ? higherRankCount + 1 : null;
    const accuracy = user.totalQuestions > 0
      ? Math.round((user.totalCorrect / user.totalQuestions) * 100)
      : 100;

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bestStreak: user.bestStreak,
        rank,
        totalGames: user.totalGames,
        totalQuestions: user.totalQuestions,
        totalCorrect: user.totalCorrect,
        accuracy,
        lastPlayedAt: user.lastPlayedAt,
        createdAt: user.createdAt,
        providers: user.oauthAccounts.map((a) => a.provider),
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ApiError(400, 'INVALID_INPUT', 'Please provide a valid display name.');
    }

    const { name } = parseResult.data;

    // Strict Anti-Cheat Guard: Reject attempts to mutate score/rank fields!
    if (req.body.bestStreak !== undefined || req.body.rank !== undefined || req.body.totalGames !== undefined) {
      throw new ApiError(400, 'FORBIDDEN_MUTATION', 'Score and rank fields are server-authoritative and cannot be modified.');
    }

    const updateData = {};
    if (name) {
      updateData.name = name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bestStreak: true,
      },
    });

    return res.json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
};
