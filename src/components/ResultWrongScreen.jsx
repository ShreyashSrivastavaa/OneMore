import React, { useEffect } from 'react';
import { Flame, RotateCcw, XCircle, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getEntityImage } from '../utils/images';
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
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isNewBest, finalStreak]);

  const bgImage = getEntityImage(question.entityB, question.category);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 text-center bg-slate-950 overflow-hidden">
      {/* Background Image of the entity that caused loss */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />

      {/* Header Spacer */}
      <div className="h-16" />

      {/* Content Box */}
      <div className="relative z-10 my-auto flex flex-col items-center space-y-6 max-w-md w-full animate-pop-in">
        {/* Wrong Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-red-500 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/40 border-2 border-white/20">
            <XCircle className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Fact Breakdown */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight font-mono uppercase drop-shadow-md">
            GAME OVER!
          </h2>
          <p className="text-slate-200 font-semibold text-lg sm:text-xl">
            “<span className="text-white font-bold">{question.entityB}</span>” has{' '}
            <span className="font-bold text-yellow-400 font-mono text-2xl">{question.displayB}</span> {question.metric.toLowerCase()}
          </p>
          <p className="text-sm text-slate-400 font-medium">
            vs “{question.entityA}” ({question.displayA})
          </p>
        </div>

        {/* New Record Banner */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full px-4 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-400 font-bold text-sm flex items-center justify-center gap-2 animate-bounce shadow-xl backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        )}

        {/* Score Summary Box */}
        <div className="w-full p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-slate-300">Final Score</span>
            <span className="text-3xl font-black text-white font-mono flex items-center gap-1.5">
              <Flame className="w-6 h-6 text-orange-500 fill-amber-400" />
              {finalStreak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">High Score</span>
            <span className="text-3xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <Trophy className="w-6 h-6 text-amber-400" />
              {bestStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button: PLAY AGAIN */}
      <div className="relative z-10 w-full max-w-md space-y-2 pb-4">
        <button
          onClick={handleRestart}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 hover:from-amber-300 hover:to-red-500 text-slate-950 font-black text-2xl tracking-wider uppercase shadow-2xl shadow-orange-500/30 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          <RotateCcw className="w-7 h-7 stroke-[3]" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
}
