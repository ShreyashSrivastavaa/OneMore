import React from 'react';
import { Play, Flame, Trophy, ArrowRight, Zap } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, theme = 'dark', onStart }) {
  const handleStart = () => {
    playTapSound();
    onStart();
  };

  const isDark = theme === 'dark';
  const accuracy = stats.totalGames > 0 ? Math.round((stats.totalCorrect / stats.totalGames) * 100) : 100;

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-between p-4 sm:p-8 text-center overflow-hidden transition-colors ${
      isDark ? 'bg-portfolio-dark text-[#f4e4d0]' : 'bg-portfolio-light text-slate-900'
    }`}>
      {/* Header Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Hero Entrance Section */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-xl w-full space-y-6 sm:space-y-8 animate-pop px-2">
        
        {/* Available Live Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono tracking-wider uppercase ${
          isDark ? 'glass-pill-dark text-slate-300' : 'glass-pill-light text-slate-700'
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_8px_#e63946] animate-pulse" />
          <span>HOW LONG CAN YOU STAY ALIVE?</span>
        </div>

        {/* Hero Title with Outlined Typography */}
        <div className="space-y-1">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase font-sans">
            <span className={isDark ? 'text-[#f4e4d0]' : 'text-slate-900'}>PLAY </span>
            <span className={isDark ? 'text-stroke-sand' : 'text-stroke-dark'}>STILL </span>
            <span className="text-[#e63946]">ALIVE</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-md mx-auto pt-2">
            Every correct answer keeps your streak alive. One mistake ends your run.
          </p>
        </div>

        {/* Portfolio-inspired Stat Strip */}
        <div className={`w-full rounded-2xl border p-4 sm:p-5 flex items-center justify-around text-center ${
          isDark ? 'glass-pill-dark' : 'glass-pill-light'
        }`}>
          <div className="space-y-0.5">
            <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-[#e63946]" />
              <span>BEST STREAK</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#f4e4d0]">{bestStreak}</div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="space-y-0.5">
            <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">GAMES</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-200">{stats.totalGames}</div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="space-y-0.5">
            <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">ACCURACY</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#00E664]">{accuracy}%</div>
          </div>
        </div>

        {/* Pill Play Button */}
        <button
          onClick={handleStart}
          className="w-full max-w-md py-4 sm:py-5 px-8 rounded-full btn-portfolio-red font-extrabold text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
          <span>START RUN →</span>
        </button>

      </div>

      {/* Footer Info */}
      <div className="relative z-10 w-full max-w-md pb-4 text-[10px] sm:text-xs font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-[#e63946]" />
        <span>INSTANT PLAY • HIGHER / LOWER TRIVIA</span>
      </div>
    </div>
  );
}
