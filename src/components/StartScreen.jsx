import React from 'react';
import { Flame, Play, Target, Award } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, onStart }) {
  const handleStart = () => {
    playTapSound();
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 text-center bg-slate-950 overflow-hidden">
      {/* Dynamic Aesthetic Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />

      {/* Header Spacer */}
      <div className="h-16" />

      {/* Main Content Box */}
      <div className="relative z-10 my-auto flex flex-col items-center space-y-6 max-w-md w-full animate-pop-in">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-red-600 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Flame className="w-16 h-16 text-orange-500 fill-amber-400 animate-float" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-lg">
            ONE MORE
          </h1>
          <p className="text-slate-300 font-semibold text-lg sm:text-xl">
            The Ultimate Comparison Trivia Game
          </p>
        </div>

        {/* High Score Badge */}
        <div className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-7 h-7 fill-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Personal Best</div>
              <div className="text-3xl font-black text-amber-400 font-mono">{bestStreak} STREAK</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats.totalGames > 0 && (
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Target className="w-3.5 h-3.5 text-orange-400" /> Games Played
              </div>
              <div className="text-xl font-bold text-white font-mono">{stats.totalGames}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Total Correct
              </div>
              <div className="text-xl font-bold text-white font-mono">{stats.totalCorrect}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Start Button */}
      <div className="relative z-10 w-full max-w-md space-y-3 pb-4">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 hover:from-amber-300 hover:to-red-500 text-slate-950 font-black text-2xl tracking-wider uppercase shadow-2xl shadow-orange-500/30 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-7 h-7 fill-slate-950" />
          <span>PLAY GAME</span>
        </button>
        <p className="text-xs text-slate-400 font-medium">
          Guess More or Less to build your streak!
        </p>
      </div>
    </div>
  );
}
