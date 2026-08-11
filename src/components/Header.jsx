import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy } from 'lucide-react';

export default function Header({ currentStreak, bestStreak }) {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-[2px]">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 font-mono">
          ONE MORE
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Score: <strong className="text-amber-400 font-mono text-base">{currentStreak}</strong></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-white/80 text-xs sm:text-sm font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>High Score: <strong className="text-amber-400 font-mono text-base">{bestStreak}</strong></span>
        </div>

        <SoundToggle />
      </div>
    </header>
  );
}
