// Global Leaderboard & Optional Player Sign-In Engine for PLAY STILL ALIVE

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'ALEX_99', streak: 42, date: '2026-08-11', badge: '🥇 CHAMPION' },
  { rank: 2, name: 'TRIVIA_GOD', streak: 38, date: '2026-08-10', badge: '🥈 LEGEND' },
  { rank: 3, name: 'SHREYASH', streak: 31, date: '2026-08-11', badge: '🥉 MASTER' },
  { rank: 4, name: 'NINJA_STREAK', streak: 27, date: '2026-08-09', badge: 'PRO' },
  { rank: 5, name: 'CYBER_ALIVE', streak: 24, date: '2026-08-08', badge: 'PRO' },
  { rank: 6, name: 'APEX_PLAYER', streak: 20, date: '2026-08-07', badge: 'RISING' },
  { rank: 7, name: 'SPEED_MASTER', streak: 18, date: '2026-08-06', badge: 'RISING' },
  { rank: 8, name: 'QUIZ_KING', streak: 15, date: '2026-08-05', badge: 'CONTENDER' },
];

export const getLeaderboard = () => {
  try {
    const stored = localStorage.getItem('psa_global_leaderboard');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {}

  return DEFAULT_LEADERBOARD;
};

export const getCurrentPlayerName = () => {
  try {
    return localStorage.getItem('psa_player_name') || '';
  } catch (e) {
    return '';
  }
};

export const setPlayerName = (name) => {
  try {
    localStorage.setItem('psa_player_name', name.trim());
  } catch (e) {}
};

export const submitScoreToLeaderboard = (playerName, streak) => {
  if (!playerName || streak <= 0) return getLeaderboard();

  const cleanName = playerName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 15) || 'ANONYMOUS';
  setPlayerName(cleanName);

  const current = getLeaderboard();
  
  // Check if player already has a recorded score
  const existingIndex = current.findIndex((item) => item.name === cleanName);
  
  if (existingIndex !== -1) {
    if (streak > current[existingIndex].streak) {
      current[existingIndex].streak = streak;
      current[existingIndex].date = new Date().toISOString().split('T')[0];
    }
  } else {
    current.push({
      rank: 0,
      name: cleanName,
      streak,
      date: new Date().toISOString().split('T')[0],
      badge: 'CONTENDER',
    });
  }

  // Sort descending by streak score
  current.sort((a, b) => b.streak - a.streak);

  // Re-assign rank numbers and badges
  const updated = current.slice(0, 20).map((item, index) => {
    let badge = 'CONTENDER';
    if (index === 0) badge = '🥇 CHAMPION';
    else if (index === 1) badge = '🥈 LEGEND';
    else if (index === 2) badge = '🥉 MASTER';
    else if (index < 5) badge = 'PRO';
    else if (index < 10) badge = 'RISING';

    return {
      ...item,
      rank: index + 1,
      badge,
    };
  });

  try {
    localStorage.setItem('psa_global_leaderboard', JSON.stringify(updated));
  } catch (e) {}

  return updated;
};
