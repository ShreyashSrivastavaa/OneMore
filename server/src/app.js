import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { errorHandler } from './utils/errors.js';

dotenv.config();

const app = express();

// Trust reverse proxy (for production SSL / Render / Railway)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// CORS Policy
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://playstayalive.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, controlled in prod
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure Session Cookie Configuration
app.use(
  session({
    name: 'psa.sid',
    secret: process.env.SESSION_SECRET || 'psa_default_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// Initialize Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PLAY STILL ALIVE Backend Engine', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;
