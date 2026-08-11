import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultCorrectScreen from './components/ResultCorrectScreen';
import ResultWrongScreen from './components/ResultWrongScreen';
import questionsData from './data/questions.json';
import { getBestStreak, saveBestStreak, getGameStats, updateGameStats } from './utils/storage';

// Screens enum
const SCREEN = {
  START: 'START',
  GAME: 'GAME',
  RESULT_CORRECT: 'RESULT_CORRECT',
  RESULT_WRONG: 'RESULT_WRONG',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREEN.START);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ totalGames: 0, totalCorrect: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [isNewBest, setIsNewBest] = useState(false);

  // Load initial best streak & stats from localStorage
  useEffect(() => {
    setBestStreak(getBestStreak());
    setStats(getGameStats());
  }, []);

  // Helper to pick next question based on current streak
  const getNextQuestion = (streak, usedIds) => {
    let targetDifficulty = 'Easy';
    if (streak >= 12) {
      targetDifficulty = 'Hard';
    } else if (streak >= 5) {
      targetDifficulty = 'Medium';
    }

    // Filter questions by difficulty that haven't been used yet
    let available = questionsData.filter(
      (q) => q.difficulty === targetDifficulty && !usedIds.has(q.id)
    );

    // Fallback if difficulty tier exhausted
    if (available.length === 0) {
      available = questionsData.filter((q) => !usedIds.has(q.id));
    }

    // Total fallback if all questions used in session
    if (available.length === 0) {
      available = questionsData;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const rawQuestion = available[randomIndex];

    // Randomize A/B orientation 50/50
    const swap = Math.random() < 0.5;
    const formattedQuestion = {
      id: rawQuestion.id,
      category: rawQuestion.category,
      metric: rawQuestion.metric,
      entityA: swap ? rawQuestion.entityB : rawQuestion.entityA,
      entityB: swap ? rawQuestion.entityA : rawQuestion.entityB,
      valueA: swap ? rawQuestion.valueB : rawQuestion.valueA,
      valueB: swap ? rawQuestion.valueA : rawQuestion.valueB,
      displayA: swap ? rawQuestion.displayB : rawQuestion.displayA,
      displayB: swap ? rawQuestion.displayA : rawQuestion.displayB,
    };

    return formattedQuestion;
  };

  const handleStartGame = () => {
    setCurrentStreak(0);
    setIsNewBest(false);
    const newUsedIds = new Set();
    const q = getNextQuestion(0, newUsedIds);
    newUsedIds.add(q.id);

    setUsedQuestionIds(newUsedIds);
    setCurrentQuestion(q);
    setCurrentScreen(SCREEN.GAME);
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

      // Directly get and load next question
      const q = getNextQuestion(nextStreak, usedQuestionIds);
      const newUsedIds = new Set(usedQuestionIds);
      newUsedIds.add(q.id);

      setUsedQuestionIds(newUsedIds);
      setCurrentQuestion(q);
      // Stay on GAME screen
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header
        currentStreak={currentStreak}
        bestStreak={bestStreak}
        isGameScreen={currentScreen === SCREEN.GAME}
      />

      <main className="flex-1 flex flex-col justify-center py-2 px-2">
        {currentScreen === SCREEN.START && (
          <StartScreen
            bestStreak={bestStreak}
            stats={stats}
            onStart={handleStartGame}
          />
        )}

        {currentScreen === SCREEN.GAME && currentQuestion && (
          <GameScreen
            key={currentQuestion.id}
            question={currentQuestion}
            currentStreak={currentStreak}
            onGuess={handleGuess}
          />
        )}

        {currentScreen === SCREEN.RESULT_WRONG && currentQuestion && (
          <ResultWrongScreen
            question={currentQuestion}
            finalStreak={currentStreak}
            bestStreak={bestStreak}
            isNewBest={isNewBest}
            onPlayAgain={handleStartGame}
          />
        )}
      </main>

      <footer className="py-2 text-center text-[11px] text-slate-600 font-mono uppercase tracking-wider">
        ONE MORE • Fast-Paced Comparison Game
      </footer>
    </div>
  );
}
