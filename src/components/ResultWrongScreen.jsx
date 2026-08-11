import React, { useEffect } from 'react';
import { RotateCcw, Flame, Trophy, Sparkles } from 'lucide-react';
import { playTapSound, playHighScoreFanfare } from '../utils/audio';

export default function ResultWrongScreen({
  question,
  finalStreak,
  bestStreak,
  isNewBest,
  theme = 'dark',
  onPlayAgain
}) {
  const handleRestart = () => {
    playTapSound();
    onPlayAgain();
  };

  useEffect(() => {
    if (isNewBest && finalStreak > 0) {
      playHighScoreFanfare();
      import('canvas-confetti').then((confettiModule) => {
        try {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.55 }
          });
        } catch (e) {}
      }).catch(() => {});
    }
  }, [isNewBest, finalStreak]);

  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-between p-4 sm:p-6 text-center overflow-hidden transition-colors ${
      isDark ? 'bg-portfolio-dark text-[#f4e4d0]' : 'bg-portfolio-light text-slate-900'
    }`}>
      {/* Header Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Main Content */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-md w-full space-y-6 animate-pop px-2">
        
        {/* Wrong Banner Stamp */}
        <div className="inline-block bg-[#e63946] text-white font-black text-3xl sm:text-5xl font-mono px-6 py-2 rounded-full border border-white/20 shadow-xl uppercase tracking-tight transform -rotate-1">
          YOU'RE OUT
        </div>

        {/* Fact Breakdown */}
        <div className="space-y-1">
          <p className={`font-bold text-base sm:text-xl ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            “<span className="font-black">{question.entityB}</span>” has{' '}
            <span className="text-[#e63946] font-mono font-black text-xl sm:text-2xl">
              {question.displayB}
            </span>
          </p>
          <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            vs “{question.entityA}” ({question.displayA})
          </p>
        </div>

        {/* New Best Record Banner */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full rounded-full bg-[#00E664] text-black font-black font-mono text-xs sm:text-sm py-2.5 px-4 border border-black shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
          </div>
        )}

        {/* Score Breakdown Box */}
        <div className={`w-full rounded-2xl border p-5 sm:p-6 space-y-4 text-left ${
          isDark ? 'glass-pill-dark' : 'glass-pill-light'
        }`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase">Streak Ended</span>
            <span className={`text-2xl sm:text-3xl font-black font-mono flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#e63946] fill-[#e63946]" />
              {finalStreak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase">Best Score</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#f4e4d0] flex items-center gap-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#f4e4d0]" />
              {bestStreak}
            </span>
          </div>
        </div>

        {/* Try Again CTA */}
        <button
          onClick={handleRestart}
          className="w-full py-4 sm:py-5 px-6 sm:px-8 rounded-full btn-portfolio-red font-extrabold text-2xl sm:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group"
        >
          <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          <span>PLAY AGAIN →</span>
        </button>

      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 w-full max-w-md pb-4 font-mono text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
        PLAY STILL ALIVE • TACTILE TRIVIA GAME
      </div>
    </div>
  );
}
