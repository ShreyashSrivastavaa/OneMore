// PLAY STILL ALIVE Client API Service

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const config = {
    credentials: 'include', // Mandates secure HTTP-only cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'API Request Failed');
    }

    return data;
  } catch (err) {
    console.warn(`[API Notice] Request to ${endpoint} failed, utilizing local engine fallback if applicable.`, err.message);
    throw err;
  }
};

export const api = {
  // Auth APIs
  getMe: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // OAuth Endpoints
  getGoogleAuthUrl: () => `${API_BASE}/auth/google`,
  getGitHubAuthUrl: () => `${API_BASE}/auth/github`,

  // Game APIs
  startGame: () => request('/game/start', { method: 'POST' }),
  submitAnswer: (sessionId, questionId, answer) =>
    request('/game/answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, questionId, answer }),
    }),

  // Leaderboard APIs
  getLeaderboard: (limit = 20, page = 1) => request(`/leaderboard?limit=${limit}&page=${page}`),
  getMyRank: () => request('/leaderboard/me'),

  // Profile APIs
  getProfile: () => request('/profile'),
  updateProfile: (name) => request('/profile', { method: 'PATCH', body: JSON.stringify({ name }) }),
};
