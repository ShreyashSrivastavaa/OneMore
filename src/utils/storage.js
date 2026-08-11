// localStorage helper for ONE MORE game persistence

const BEST_STREAK_KEY = 'onemore_best_streak';
const GAME_STATS_KEY = 'onemore_stats';

export const getBestStreak = () => {
  try {
    const val = localStorage.getItem(BEST_STREAK_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const saveBestStreak = (newStreak) => {
  try {
    const currentBest = getBestStreak();
    if (newStreak > currentBest) {
      localStorage.setItem(BEST_STREAK_KEY, newStreak.toString());
      return true; // Return true if new record achieved
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const getGameStats = () => {
  try {
    const data = localStorage.getItem(GAME_STATS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {}
  
  return {
    totalGames: 0,
    totalCorrect: 0,
  };
};

export const updateGameStats = (isCorrect) => {
  try {
    const stats = getGameStats();
    stats.totalGames = (stats.totalGames || 0) + (isCorrect ? 0 : 1);
    if (isCorrect) {
      stats.totalCorrect = (stats.totalCorrect || 0) + 1;
    }
    localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats));
  } catch (e) {}
};
