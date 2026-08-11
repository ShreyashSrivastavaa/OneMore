import React, { useEffect } from 'react';
import { Flame, RotateCcw, XCircle, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTapSound, playHighScoreFanfare } from '../utils/audio';

export default function ResultWrongScreen({
  question,
  finalStreak,
  bestStreak,
  isNewBest,
  onPlayAgain
}) {
  const handleRestart = () => {
    playTapSound();
    onPlayAgain();
  };

  useEffect(() => {
    if (isNewBest && finalStreak > 0) {
      playHighScoreFanfare();
      // Launch confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isNewBest, finalStreak]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-5 py-6 text-center animate-pop-in">
      <div className="my-auto flex flex-col items-center space-y-6">
        {/* Wrong Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-red-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/30">
            <XCircle className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Header & Comparison Breakdown */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight font-mono uppercase">
            ❌ WRONG!
          </h2>
          <p className="text-slate-300 font-medium text-base sm:text-lg">
            <span className="font-bold text-white">{question.entityB}</span> ({question.displayB})
          </p>
          <p className="text-xs text-slate-400">
            vs {question.entityA} ({question.displayA})
          </p>
        </div>

        {/* New Record Banner if applicable */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        )}

        {/* Score Summary Box */}
        <div className="w-full max-w-xs p-5 rounded-2xl glass-card border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <span className="text-sm font-semibold text-slate-400">Your Streak</span>
            <span className="text-2xl font-black text-white font-mono flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-500 fill-amber-400" />
              {finalStreak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">Best Streak</span>
            <span className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              {bestStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: PLAY AGAIN */}
      <div className="w-full space-y-2 pt-4">
        <button
          onClick={handleRestart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xl tracking-wider uppercase shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>PLAY AGAIN</span>
        </button>
        <p className="text-xs text-slate-500">Don't give up! Try for ONE MORE streak.</p>
      </div>
    </div>
  );
}
