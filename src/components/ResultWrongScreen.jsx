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
      isDark ? 'bg-grid-dark text-[#F5F3E9]' : 'bg-grid-light text-slate-900'
    }`}>
      {/* Header Spacer */}
      <div className="h-14 sm:h-16" />

      {/* Main Content */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-md w-full space-y-5 sm:space-y-6 animate-pop px-2">
        
        {/* Wrong Banner Stamp */}
        <div className="inline-block bg-[#FF3333] text-white font-black text-3xl sm:text-5xl font-mono px-5 sm:px-6 py-2 border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] uppercase tracking-tight transform -rotate-2">
          GAME OVER
        </div>

        {/* Fact Breakdown */}
        <div className="space-y-1">
          <p className={`font-bold text-base sm:text-xl ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            “<span className="font-black">{question.entityB}</span>” has{' '}
            <span className="text-[#E2FF00] font-mono font-black text-xl sm:text-2xl drop-shadow-[1px_1px_0px_#000]">
              {question.displayB}
            </span>
          </p>
          <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            vs “{question.entityA}” ({question.displayA})
          </p>
        </div>

        {/* New Best Record Banner */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full bg-[#E2FF00] text-black font-black font-mono text-xs sm:text-sm py-2.5 px-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
          </div>
        )}

        {/* Score Breakdown Box */}
        <div className={`w-full border-3 border-black shadow-[5px_5px_0px_0px_#000] p-5 sm:p-6 space-y-4 text-left ${
          isDark ? 'bg-[#16181a]' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between border-b-2 border-black/80 pb-3">
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase">Streak Ended</span>
            <span className={`text-2xl sm:text-3xl font-black font-mono flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#E2FF00] fill-[#E2FF00]" />
              {finalStreak}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase">Best Score</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#E2FF00] drop-shadow-[1px_1px_0px_#000] flex items-center gap-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#E2FF00]" />
              {bestStreak}
            </span>
          </div>
        </div>

        {/* Try Again CTA */}
        <button
          onClick={handleRestart}
          className="w-full py-4 sm:py-5 px-6 sm:px-8 brutal-btn-yellow font-black text-2xl sm:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group active:scale-95"
        >
          <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          <span>TRY AGAIN</span>
        </button>

      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 w-full max-w-md pb-4 font-mono text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">
        ONE MORE • TACTILE TRIVIA GAME
      </div>
    </div>
  );
}
