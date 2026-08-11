import React, { useEffect } from 'react';
import { RotateCcw, Flame, Trophy, Sparkles } from 'lucide-react';
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
          particleCount: 140,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch (e) {}
    }
  }, [isNewBest, finalStreak]);

  const bgImage = getEntityImage(question.entityB, question.category);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 text-center bg-[#0c0d0e] overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-[#0c0d0e]/85" />

      {/* Header Spacer */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-md w-full space-y-6 animate-pop">
        
        {/* Wrong Banner Stamp */}
        <div className="inline-block bg-[#FF3333] text-white font-black text-4xl sm:text-5xl font-mono px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_#000] uppercase tracking-tight transform -rotate-2">
          WRONG
        </div>

        {/* Fact Breakdown */}
        <div className="space-y-1">
          <p className="text-slate-200 font-bold text-lg sm:text-xl">
            “<span className="text-white font-black">{question.entityB}</span>” has{' '}
            <span className="text-[#E2FF00] font-mono font-black text-2xl">{question.displayB}</span>
          </p>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            vs “{question.entityA}” ({question.displayA})
          </p>
        </div>

        {/* New Best Record Banner */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full bg-[#E2FF00] text-black font-black font-mono text-sm py-2 px-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5 fill-black" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-5 h-5 fill-black" />
          </div>
        )}

        {/* Score Breakdown Box */}
        <div className="w-full bg-[#16181a] border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6 space-y-4 text-left">
          <div className="flex items-center justify-between border-b-2 border-black/80 pb-3">
            <span className="text-sm font-mono font-bold text-slate-400 uppercase">Streak Ended</span>
            <span className="text-3xl font-black font-mono text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#E2FF00] fill-[#E2FF00]" />
              {finalStreak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-slate-400 uppercase">Best Score</span>
            <span className="text-3xl font-black font-mono text-[#E2FF00] flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#E2FF00]" />
              {bestStreak}
            </span>
          </div>
        </div>

        {/* Try Again CTA */}
        <button
          onClick={handleRestart}
          className="w-full py-5 px-8 brutal-btn-yellow font-black text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group"
        >
          <RotateCcw className="w-7 h-7 stroke-[3]" />
          <span>TRY AGAIN</span>
        </button>

      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 w-full max-w-md pb-4 font-mono text-xs text-slate-500 uppercase tracking-widest">
        ONE MORE • TACTILE TRIVIA GAME
      </div>
    </div>
  );
}
