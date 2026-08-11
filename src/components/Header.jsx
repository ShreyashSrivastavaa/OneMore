import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy, Sun, Moon, User } from 'lucide-react';
import { playTapSound } from '../utils/audio';
import { getCurrentPlayerName } from '../utils/leaderboard';

export default function Header({ currentStreak, bestStreak, theme, onToggleTheme, onOpenLeaderboard, onOpenAuth }) {
  const handleThemeClick = () => {
    playTapSound();
    onToggleTheme();
  };

  const isDark = theme === 'dark';
  const currentPlayer = getCurrentPlayerName();

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

        {/* Sign In Button */}
        <button
          onClick={() => {
            playTapSound();
            if (onOpenAuth) onOpenAuth();
          }}
          className={`flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1.5 rounded-full border transition-all cursor-pointer active:scale-95 ${
            currentPlayer
              ? 'border-[#00E664]/50 bg-[#00E664]/10 text-[#00E664]'
              : isDark ? 'glass-pill-dark text-slate-300 hover:border-[#00E664]' : 'glass-pill-light text-slate-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{currentPlayer ? `@${currentPlayer}` : 'SIGN IN'}</span>
        </button>

        {/* High Score & Leaderboard Trigger */}
        <button
          onClick={() => {
            playTapSound();
            if (onOpenLeaderboard) onOpenLeaderboard();
          }}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono px-3.5 py-1.5 rounded-full border transition-all cursor-pointer active:scale-95 ${
            isDark ? 'glass-pill-dark text-slate-300 hover:border-[#e63946]' : 'glass-pill-light text-slate-700 hover:border-black'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#e63946]" />
          <span className="hidden sm:inline">BEST: <strong className="font-mono text-sm sm:text-base text-[#f4e4d0]">{bestStreak}</strong></span>
          <span className="sm:hidden">RANK</span>
        </button>

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
