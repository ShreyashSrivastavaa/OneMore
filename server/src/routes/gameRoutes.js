import { Router } from 'express';
import { startGame, submitAnswer } from '../controllers/gameController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { gameAnswerLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/start', optionalAuth, startGame);
router.post('/answer', optionalAuth, gameAnswerLimiter, submitAnswer);

export default router;
