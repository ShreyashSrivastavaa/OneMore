import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 auth attempts per IP
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
});

export const gameAnswerLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 15, // Max 15 answer submissions per 10 seconds (anti-bot)
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Game submissions sent too rapidly. Please slow down.',
    },
  },
});
