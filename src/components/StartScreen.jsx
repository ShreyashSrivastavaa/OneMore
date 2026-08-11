import React from 'react';
import { Play, Flame, Zap } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, theme = 'dark', onStart }) {
  const handleStart = () => {
    playTapSound();
    onStart();
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-between p-4 sm:p-6 text-center overflow-hidden transition-colors ${
      isDark ? 'bg-grid-dark text-[#F5F3E9]' : 'bg-grid-light text-slate-900'
    }`}>
      {/* Header Spacer */}
      <div className="h-14 sm:h-16" />

      {/* Hero Entrance Card */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-lg w-full space-y-6 sm:space-y-8 animate-pop px-2">
        
        {/* Brand Stamp Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-block bg-[#E2FF00] text-black font-black text-4xl sm:text-7xl font-mono px-5 sm:px-6 py-2 border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] tracking-tighter uppercase transform -rotate-2">
            ONE MORE
          </div>
          
          <p className={`text-lg sm:text-2xl font-bold max-w-sm mx-auto leading-snug ${
            isDark ? 'text-[#F5F3E9]' : 'text-slate-900'
          }`}>
            Which entity ranks higher? One mistake ends the streak.
          </p>
        </div>

        {/* Record Badge */}
        <div className={`w-full border-3 border-black shadow-[5px_5px_0px_0px_#000] p-4 sm:p-5 flex items-center justify-between text-left ${
          isDark ? 'bg-[#16181a]' : 'bg-white'
        }`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-[#E2FF00] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 fill-black" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Personal Best</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#E2FF00] drop-shadow-[1px_1px_0px_#000]">{bestStreak} STREAK</div>
            </div>
          </div>
          <div className="hidden sm:block text-right font-mono text-xs text-slate-400 font-bold">
            <div>GAMES: <strong className={isDark ? 'text-white' : 'text-black'}>{stats.totalGames}</strong></div>
            <div>CORRECT: <strong className={isDark ? 'text-white' : 'text-black'}>{stats.totalCorrect}</strong></div>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 sm:py-5 px-6 sm:px-8 brutal-btn-yellow font-black text-2xl sm:text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group active:scale-95"
        >
          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black" />
          <span>PLAY GAME</span>
        </button>

      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 w-full max-w-md pb-4 text-[10px] sm:text-xs font-mono text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E2FF00]" />
        <span>NO REGISTRATION • NO ADS • INSTANT PLAY</span>
      </div>
    </div>
  );
}
