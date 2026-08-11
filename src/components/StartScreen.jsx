import React from 'react';
import { Play, Flame, Trophy, Zap } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, onStart }) {
  const handleStart = () => {
    playTapSound();
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 text-center bg-[#0c0d0e] overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2328_1px,transparent_1px),linear-gradient(to_bottom,#1f2328_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Header Spacer */}
      <div className="h-16" />

      {/* Hero Entrance Card */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-lg w-full space-y-8 animate-pop">
        
        {/* Brand Stamp Header */}
        <div className="space-y-4">
          <div className="inline-block bg-[#E2FF00] text-black font-black text-5xl sm:text-7xl font-mono px-6 py-2 border-4 border-black shadow-[8px_8px_0px_0px_#000] tracking-tighter uppercase transform -rotate-2">
            ONE MORE
          </div>
          
          <p className="text-xl sm:text-2xl font-bold text-[#F5F3E9] max-w-sm mx-auto leading-snug">
            Which entity ranks higher? One mistake ends the streak.
          </p>
        </div>

        {/* Record Badge */}
        <div className="w-full bg-[#16181a] border-3 border-black shadow-[6px_6px_0px_0px_#000] p-5 flex items-center justify-between text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#E2FF00] border-2 border-black text-black">
              <Flame className="w-8 h-8 fill-black" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Personal Best</div>
              <div className="text-3xl font-black font-mono text-[#E2FF00]">{bestStreak} STREAK</div>
            </div>
          </div>
          <div className="hidden sm:block text-right font-mono text-xs text-slate-400">
            <div>GAMES: <strong className="text-white">{stats.totalGames}</strong></div>
            <div>CORRECT: <strong className="text-white">{stats.totalCorrect}</strong></div>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={handleStart}
          className="w-full py-5 px-8 brutal-btn-yellow font-black text-3xl tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Play className="w-8 h-8 fill-black" />
          <span>PLAY GAME</span>
        </button>

      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 w-full max-w-md pb-4 text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-[#E2FF00]" />
        <span>NO REGISTRATION • NO ADS • INSTANT PLAY</span>
      </div>
    </div>
  );
}
