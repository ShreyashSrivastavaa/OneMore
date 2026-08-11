import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy } from 'lucide-react';

export default function Header({ currentStreak, bestStreak }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between">
      {/* Brand Title Badge */}
      <div className="flex items-center gap-2">
        <div className="bg-[#E2FF00] text-black font-black text-lg sm:text-xl font-mono px-3 py-1 border-3 border-black shadow-[3px_3px_0px_0px_#000] tracking-tighter uppercase transform -rotate-1">
          ONE MORE
        </div>
      </div>

      {/* Score HUD Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 bg-[#16181a] text-white text-xs sm:text-sm font-bold font-mono px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <Flame className="w-4 h-4 text-[#E2FF00] fill-[#E2FF00]" />
          <span>STREAK: <strong className="text-[#E2FF00] text-base">{currentStreak}</strong></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-[#16181a] text-slate-300 text-xs sm:text-sm font-bold font-mono px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
          <Trophy className="w-3.5 h-3.5 text-[#E2FF00]" />
          <span>BEST: <strong className="text-white text-base">{bestStreak}</strong></span>
        </div>

        <SoundToggle />
      </div>
    </header>
  );
}
