import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy, Sun, Moon } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function Header({ currentStreak, bestStreak, theme, onToggleTheme }) {
  const handleThemeClick = () => {
    playTapSound();
    onToggleTheme();
  };

  const isDark = theme === 'dark';

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 sm:px-8 py-4 flex items-center justify-between">
      {/* Brand Title Badge with Live Status Dot */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border transition-all ${
          isDark ? 'glass-pill-dark text-[#f4e4d0]' : 'glass-pill-light text-black'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="font-black text-xs sm:text-sm tracking-wider uppercase font-mono">
            PLAY STILL ALIVE
          </span>
        </div>
      </div>

      {/* Score HUD & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Indicator */}
        <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono px-3.5 py-1.5 rounded-full border transition-all ${
          isDark ? 'glass-pill-dark text-white' : 'glass-pill-light text-black'
        }`}>
          <Flame className="w-4 h-4 text-[#e63946] fill-[#e63946]" />
          <span>ALIVE: <strong className="text-[#e63946] font-mono text-sm sm:text-base">{currentStreak}</strong></span>
        </div>

        {/* High Score */}
        <div className={`hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono px-3.5 py-1.5 rounded-full border transition-all ${
          isDark ? 'glass-pill-dark text-slate-300' : 'glass-pill-light text-slate-700'
        }`}>
          <Trophy className="w-3.5 h-3.5 text-[#f4e4d0]" />
          <span>BEST: <strong className="font-mono text-sm sm:text-base text-[#f4e4d0]">{bestStreak}</strong></span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeClick}
          aria-label="Toggle Theme"
          className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
            isDark ? 'glass-pill-dark text-white hover:border-[#e63946]' : 'glass-pill-light text-black hover:border-black'
          }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#f4e4d0]" />
          ) : (
            <Moon className="w-4 h-4 text-slate-900" />
          )}
        </button>

        <SoundToggle />
      </div>
    </header>
  );
}
