import { Router } from 'express';
import passport from 'passport';
import { getMe, register, login, logout } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/me', getMe);
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_error=google`,
  }),
  (req, res) => {
    const userName = req.user ? req.user.name : 'PLAYER';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_success=true&user=${encodeURIComponent(userName)}`);
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_error=github`,
  }),
  (req, res) => {
    const userName = req.user ? req.user.name : 'PLAYER';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_success=true&user=${encodeURIComponent(userName)}`);
  }
);

export default router;
