import React from 'react';
import { Play, Trophy, ArrowRight } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, theme = 'dark', onStart, onOpenLeaderboard, onOpenAuth }) {
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
      <div className="relative z-10 my-auto flex flex-col items-center max-w-xl w-full space-y-5 sm:space-y-6 animate-pop px-2">
        
        {/* Clean Hero Logo Banner Emblem (Zero Black Padding/Borders) */}
        <div className="flex items-center justify-center">
          <div className="relative group p-1">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#e63946] via-amber-500 to-[#00E664] rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all" />
            <img
              src="/PLAYSTILLALIVE.png"
              alt="PLAY STILL ALIVE Logo"
              className="relative max-w-[260px] sm:max-w-[320px] h-auto object-cover rounded-2xl shadow-2xl animate-pop border border-white/20"
            />
          </div>
        </div>

        {/* Available Live Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono tracking-wider uppercase ${
          isDark ? 'glass-pill-dark text-slate-300' : 'glass-pill-light text-slate-700'
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_8px_#e63946] animate-pulse" />
          <span>HOW LONG CAN YOU STAY ALIVE?</span>
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

        {/* Main CTA Button */}
        <button
          onClick={handleStart}
          className="w-full py-5 px-8 rounded-2xl btn-portfolio-red font-black font-sans text-xl sm:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 shadow-2xl pt-4"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>START GAME</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Global Leaderboard Button */}
        <button
          onClick={() => {
            playTapSound();
            if (onOpenLeaderboard) onOpenLeaderboard();
          }}
          className={`w-full py-3 px-6 rounded-2xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
            isDark ? 'glass-pill-dark text-slate-300 hover:border-[#00E664]' : 'glass-pill-light text-slate-700 hover:border-black'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#00E664]" />
          <span>VIEW GLOBAL LEADERBOARD</span>
        </button>

      </div>

      {/* Footer Spacer */}
      <div className="h-6 sm:h-8" />
    </div>
  );
}
