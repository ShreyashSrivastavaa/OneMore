import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultWrongScreen from './components/ResultWrongScreen';
import LeaderboardModal from './components/LeaderboardModal';
import AuthModal from './components/AuthModal';
import { getBestStreak, saveBestStreak, getGameStats, updateGameStats } from './utils/storage';
import { generateDynamicQuestion } from './utils/questionEngine';
import { preloadQuestionImages } from './utils/images';
import { api } from './api/client';
import { setPlayerName } from './utils/leaderboard';

const SCREEN = {
  START: 'START',
  GAME: 'GAME',
  RESULT_WRONG: 'RESULT_WRONG',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREEN.START);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ totalGames: 0, totalCorrect: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('onemore_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('onemore_theme', nextTheme);
    } catch (e) {}
  };

  // Restore authenticated session from backend or URL params on startup
  useEffect(() => {
    setBestStreak(getBestStreak());
    setStats(getGameStats());

    const checkAuth = async () => {
      try {
        const data = await api.getMe();
        if (data && data.user) {
          setUser(data.user);
          setPlayerName(data.user.name);
          if (data.user.bestStreak > getBestStreak()) {
            setBestStreak(data.user.bestStreak);
            saveBestStreak(data.user.bestStreak);
          }
        }
      } catch (e) {}
    };

    checkAuth();

    // Check OAuth URL redirects
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_success') === 'true') {
      checkAuth();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStartGame = async () => {
    setCurrentStreak(0);
    setIsNewBest(false);

    try {
      // Try backend server-authoritative session
      const serverGame = await api.startGame();
      if (serverGame && serverGame.sessionId && serverGame.question) {
        setSessionId(serverGame.sessionId);
        setCurrentQuestion(serverGame.question);
        setCurrentScreen(SCREEN.GAME);
        preloadQuestionImages(serverGame.question);
        return;
      }
    } catch (e) {}

    // Dynamic local fallback if server is offline in dev
    const localQ = generateDynamicQuestion(0);
    setCurrentQuestion(localQ);
    setCurrentScreen(SCREEN.GAME);
    preloadQuestionImages(localQ);
  };

  const handleGuess = async (choice) => {
    // Attempt server-authoritative answer evaluation
    if (sessionId && currentQuestion) {
      try {
        const res = await api.submitAnswer(sessionId, currentQuestion.id, choice);
        updateGameStats(res.correct);
        setStats(getGameStats());

        setTimeout(() => {
          if (res.correct) {
            const nextStreak = res.streak;
            setCurrentStreak(nextStreak);

            if (res.isNewBest || nextStreak > bestStreak) {
              setBestStreak(nextStreak);
              saveBestStreak(nextStreak);
              setIsNewBest(true);
            }

            if (res.nextQuestion) {
              setCurrentQuestion(res.nextQuestion);
              preloadQuestionImages(res.nextQuestion);
            }
          } else {
            setCurrentScreen(SCREEN.RESULT_WRONG);
          }
        }, 200);

        return res;
      } catch (e) {}
    }

    // Local evaluation fallback
    let isCorrect = false;
    if (currentQuestion.formatType === 'PICK_WINNER') {
      isCorrect = (choice === 'A' && currentQuestion.aIsBigger) || (choice === 'B' && !currentQuestion.aIsBigger);
    } else if (currentQuestion.formatType === 'TIMELINE') {
      isCorrect = (choice === 'A' && currentQuestion.aIsEarlier) || (choice === 'B' && !currentQuestion.aIsEarlier);
    } else if (currentQuestion.formatType === 'OVER_UNDER') {
      isCorrect = (choice === 'OVER' && currentQuestion.isOver) || (choice === 'UNDER' && !currentQuestion.isOver);
    }

    updateGameStats(isCorrect);
    setStats(getGameStats());

    setTimeout(() => {
      if (isCorrect) {
        const nextStreak = currentStreak + 1;
        setCurrentStreak(nextStreak);

        const recordBroken = saveBestStreak(nextStreak);
        if (recordBroken) {
          setBestStreak(nextStreak);
          setIsNewBest(true);
        }

        const q = generateDynamicQuestion(nextStreak);
        setCurrentQuestion(q);
        setCurrentScreen(SCREEN.GAME);
      } else {
        const recordBroken = saveBestStreak(currentStreak);
        if (recordBroken) {
          setBestStreak(currentStreak);
          setIsNewBest(true);
        }
        setCurrentScreen(SCREEN.RESULT_WRONG);
      }
    }, 200);

    return { correct: isCorrect };
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#050508] text-[#f4e4d0]' : 'bg-[#FAF8F5] text-[#0c0d0e]'
    }`}>
      <Header
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 flex flex-col justify-center">
        {currentScreen === SCREEN.START && (
          <StartScreen
            bestStreak={bestStreak}
            stats={stats}
            theme={theme}
            onStart={handleStartGame}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentScreen === SCREEN.GAME && currentQuestion && (
          <GameScreen
            key={currentQuestion.id || 'current_q'}
            question={currentQuestion}
            currentStreak={currentStreak}
            theme={theme}
            onGuess={handleGuess}
          />
        )}

        {currentScreen === SCREEN.RESULT_WRONG && currentQuestion && (
          <ResultWrongScreen
            question={currentQuestion}
            finalStreak={currentStreak}
            bestStreak={bestStreak}
            isNewBest={isNewBest}
            theme={theme}
            onPlayAgain={handleStartGame}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Global Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          theme={theme}
          currentStreak={bestStreak}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {/* Player Sign-In Modal */}
      {isAuthOpen && (
        <AuthModal
          theme={theme}
          onClose={() => setIsAuthOpen(false)}
          onSignedIn={(name) => {
            if (name) {
              setUser({ name });
            } else {
              setUser(null);
            }
          }}
        />
      )}

      <footer className={`py-2 text-center text-[11px] font-mono uppercase tracking-wider ${
        theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
      }`}>
        PLAY STILL ALIVE • TACTILE TRIVIA GAME
      </footer>
    </div>
  );
}
