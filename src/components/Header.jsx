import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy, Sun, Moon } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function Header({ currentStreak, bestStreak, theme, onToggleTheme }) {
  const handleThemeClick = () => {
    playTapSound();
    onToggleTheme();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 sm:px-6 py-3 flex items-center justify-between">
      {/* Brand Title Badge */}
      <div className="flex items-center gap-2">
        <div className="bg-[#E2FF00] text-black font-black text-lg sm:text-xl font-mono px-3 py-1 border-3 border-black shadow-[3px_3px_0px_0px_#000] tracking-tighter uppercase transform -rotate-1">
          PLAY STILL ALIVE
        </div>
      </div>

      {/* Score HUD Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${
          theme === 'dark' ? 'bg-[#16181a] text-white' : 'bg-white text-black'
        }`}>
          <Flame className="w-4 h-4 text-[#E2FF00] fill-[#E2FF00]" />
          <span>STREAK: <strong className="text-[#E2FF00] text-base">{currentStreak}</strong></span>
        </div>

        <div className={`hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000] ${
          theme === 'dark' ? 'bg-[#16181a] text-slate-300' : 'bg-white text-slate-700'
        }`}>
          <Trophy className="w-3.5 h-3.5 text-[#E2FF00]" />
          <span>BEST: <strong className="font-mono text-base">{bestStreak}</strong></span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeClick}
          aria-label="Toggle Theme"
          className={`p-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer flex items-center gap-1 font-mono text-xs font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            theme === 'dark' ? 'bg-[#16181a] text-white' : 'bg-white text-black'
          }`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[#E2FF00]" />
              <span className="hidden sm:inline">LIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">DARK</span>
            </>
          )}
        </button>

        <SoundToggle />
      </div>
    </header>
  );
}
