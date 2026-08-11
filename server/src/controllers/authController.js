import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { ApiError } from '../utils/errors.js';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bestStreak: true,
        totalGames: true,
        totalCorrect: true,
        totalQuestions: true,
        lastPlayedAt: true,
        createdAt: true,
      },
    });

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ApiError(400, 'INVALID_INPUT', 'Please provide valid registration details.');
    }

    const { name, email, password } = parseResult.data;
    const cleanName = name.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bestStreak: true,
        totalGames: true,
        totalCorrect: true,
      },
    });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({ user });
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ApiError(400, 'INVALID_INPUT', 'Please provide valid credentials.');
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bestStreak: user.bestStreak,
        },
      });
    });
  } catch (err) {
    return next(err);
  }
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('psa.sid');
      return res.json({ success: true, message: 'Logged out successfully' });
    });
  });
};
