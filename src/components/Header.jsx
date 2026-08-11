import React from 'react';
import SoundToggle from './SoundToggle';
import { Flame, Trophy } from 'lucide-react';

export default function Header({ currentStreak, bestStreak, isGameScreen = false }) {
  return (
    <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 flex items-center gap-1 font-mono">
          ONE MORE
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {isGameScreen ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-amber-400 font-bold text-sm animate-pulse-glow">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{currentStreak} STREAK</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST: {bestStreak}</span>
          </div>
        )}
        <SoundToggle />
      </div>
    </header>
  );
}
