import React from 'react';
import { Flame, Play, Sparkles, Target, Award } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export default function StartScreen({ bestStreak, stats, onStart }) {
  const handleStart = () => {
    playTapSound();
    onStart();
  };

  const accuracy = stats.totalGames > 0
    ? Math.round((stats.totalCorrect / stats.totalGames) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-5 py-6 text-center animate-pop-in">
      {/* Top Banner & Hero */}
      <div className="my-auto flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-red-600 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Flame className="w-14 h-14 text-orange-500 fill-amber-400 animate-float" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
            ONE MORE
          </h1>
          <p className="text-slate-400 font-medium text-base sm:text-lg">
            How far can you go?
          </p>
        </div>

        {/* Best Streak Badge */}
        <div className="w-full max-w-xs px-6 py-4 rounded-2xl glass-card border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Personal Best</div>
              <div className="text-2xl font-black text-white font-mono">{bestStreak} STREAK</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        {stats.totalGames > 0 && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Target className="w-3.5 h-3.5 text-orange-400" /> Games
              </div>
              <div className="text-lg font-bold text-white font-mono">{stats.totalGames}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Correct
              </div>
              <div className="text-lg font-bold text-white font-mono">{stats.totalCorrect}</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="w-full space-y-3 pt-4">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xl tracking-wider uppercase shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>START GAME</span>
        </button>
        <p className="text-xs text-slate-500">
          One wrong answer ends the game. Good luck!
        </p>
      </div>
    </div>
  );
}
