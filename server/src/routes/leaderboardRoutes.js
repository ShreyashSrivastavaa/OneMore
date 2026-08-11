import { Router } from 'express';
import { getLeaderboard, getMyRank } from '../controllers/leaderboardController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getLeaderboard);
router.get('/me', optionalAuth, getMyRank);

export default router;
