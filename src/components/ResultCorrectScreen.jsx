import React, { useEffect } from 'react';
import { Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function ResultCorrectScreen({
  question,
  newStreak,
  onNextQuestion
}) {
  const handleNext = () => {
    playTapSound();
    onNextQuestion();
  };

  // Allow pressing Enter or Space to quickly advance
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-5 py-6 text-center animate-pop-in">
      <div className="my-auto flex flex-col items-center space-y-6">
        {/* Correct Icon */}
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Title & Revealed Fact */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-mono uppercase">
            ✅ CORRECT!
          </h2>
          <p className="text-slate-300 font-medium text-base sm:text-lg">
            <span className="font-bold text-white">{question.entityB}</span> has{' '}
            <span className="font-bold text-amber-400 font-mono">{question.displayB}</span> {question.metric.toLowerCase()}
          </p>
          <p className="text-xs text-slate-400">
            vs {question.entityA} ({question.displayA})
          </p>
        </div>

        {/* Streak Increment Card */}
        <div className="px-6 py-4 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-amber-400 flex items-center gap-3 shadow-xl animate-pulse-glow">
          <Flame className="w-8 h-8 fill-amber-400 text-amber-400 animate-float" />
          <div className="text-left">
            <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">Current Streak</div>
            <div className="text-3xl font-black text-white font-mono">{newStreak} STREAK</div>
          </div>
        </div>
      </div>

      {/* Action Button: ONE MORE */}
      <div className="w-full space-y-2 pt-4">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xl tracking-wider uppercase shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>KEEP ALIVE</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
        <p className="text-xs text-slate-500">Tap or press Space to continue</p>
      </div>
    </div>
  );
}
