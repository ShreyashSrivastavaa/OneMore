import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultWrongScreen from './components/ResultWrongScreen';
import questionsData from './data/questions.json';
import { getBestStreak, saveBestStreak, getGameStats, updateGameStats } from './utils/storage';
import { generateRoundData } from './utils/formatters';
import { preloadQuestionImages } from './utils/images';

const SCREEN = {
  START: 'START',
  GAME: 'GAME',
  RESULT_WRONG: 'RESULT_WRONG',
};

import { generateDynamicQuestion } from './utils/questionEngine';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREEN.START);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ totalGames: 0, totalCorrect: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [isNewBest, setIsNewBest] = useState(false);
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

  useEffect(() => {
    setBestStreak(getBestStreak());
    setStats(getGameStats());
  }, []);

  const getNextQuestion = (streak) => {
    return generateDynamicQuestion(streak);
  };

  // Immediate Background Preloading for Current & Next Questions
  useEffect(() => {
    if (currentQuestion && currentScreen === SCREEN.GAME) {
      // 1. High priority preload for current question
      preloadQuestionImages(currentQuestion);

      // 2. Preload NEXT question images immediately in the background
      try {
        const nextQ = getNextQuestion(currentStreak + 1, usedQuestionIds);
        if (nextQ) {
          preloadQuestionImages(nextQ);
        }
      } catch (e) {}
    }
  }, [currentQuestion, currentStreak, currentScreen, usedQuestionIds]);

  const handleStartGame = () => {
    setCurrentStreak(0);
    setIsNewBest(false);
    const newUsedIds = new Set();
    const q = getNextQuestion(0, newUsedIds);
    newUsedIds.add(q.id);

    setUsedQuestionIds(newUsedIds);
    setCurrentQuestion(q);
    setCurrentScreen(SCREEN.GAME);

    // Preload first round images immediately
    preloadQuestionImages(q);
  };

  const handleGuess = (isCorrect) => {
    updateGameStats(isCorrect);
    setStats(getGameStats());

    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);

      const recordBroken = saveBestStreak(nextStreak);
      if (recordBroken) {
        setBestStreak(nextStreak);
        setIsNewBest(true);
      }

      const q = getNextQuestion(nextStreak, usedQuestionIds);
      const newUsedIds = new Set(usedQuestionIds);
      newUsedIds.add(q.id);

      setUsedQuestionIds(newUsedIds);
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
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0c0d0e] text-[#F5F3E9]' : 'bg-[#FAF8F5] text-[#0c0d0e]'
    }`}>
      <Header
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 flex flex-col justify-center">
        {currentScreen === SCREEN.START && (
          <StartScreen
            bestStreak={bestStreak}
            stats={stats}
            theme={theme}
            onStart={handleStartGame}
          />
        )}

        {currentScreen === SCREEN.GAME && currentQuestion && (
          <GameScreen
            key={currentQuestion.id}
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
          />
        )}
      </main>

      <footer className={`py-2 text-center text-[11px] font-mono uppercase tracking-wider ${
        theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
      }`}>
        PLAY STILL ALIVE • TACTILE TRIVIA GAME
      </footer>
    </div>
  );
}
