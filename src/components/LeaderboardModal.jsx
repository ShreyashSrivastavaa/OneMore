import React, { useState } from 'react';
import { X, Trophy, Flame, UserCheck, ShieldAlert } from 'lucide-react';
import { getLeaderboard, getCurrentPlayerName, submitScoreToLeaderboard } from '../utils/leaderboard';
import { playTapSound } from '../utils/audio';

export default function LeaderboardModal({ theme = 'dark', currentStreak = 0, onClose }) {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [handleInput, setHandleInput] = useState(getCurrentPlayerName());
  const [isSaved, setIsSaved] = useState(false);

  const isDark = theme === 'dark';

  const handleSaveHandle = (e) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    playTapSound();
    const updated = submitScoreToLeaderboard(handleInput, currentStreak);
    setLeaderboard(updated);
    setIsSaved(true);

    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop">
      <div className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'glass-pill-dark text-[#f4e4d0]' : 'glass-pill-light text-slate-900'
      }`}>

        {/* Close Button */}
        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/20 hover:border-red-500 cursor-pointer transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wider uppercase text-[#e63946] border-[#e63946]/30 bg-[#e63946]/10">
            <Trophy className="w-3.5 h-3.5" />
            <span>GLOBAL LEADERBOARD</span>
          </div>
          <h2 className="text-3xl font-black font-sans tracking-tight">TOP ALIVE PLAYERS</h2>
          <p className="text-xs font-mono text-slate-400">Optional sign-in to upload & claim your streak rank!</p>
        </div>

        {/* Optional Player Sign-In / Handle Input Form */}
        <form onSubmit={handleSaveHandle} className="space-y-3 pt-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Player Handle / Username:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="ENTER YOUR HANDLE (e.g. ALEX_99)"
              maxLength={15}
              className={`flex-1 px-4 py-3 rounded-full border font-mono text-sm font-bold uppercase tracking-wider outline-none transition-all ${
                isDark ? 'bg-black/60 border-white/20 text-white focus:border-[#e63946]' : 'bg-slate-100 border-slate-300 text-black focus:border-black'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-full btn-portfolio-red font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSaved ? 'SAVED!' : 'CLAIM'}</span>
            </button>
          </div>
        </form>

        {/* Leaderboard Table */}
        <div className="space-y-2 pt-2">
          {leaderboard.map((item) => {
            const isCurrentPlayer = item.name === getCurrentPlayerName().toUpperCase();
            return (
              <div
                key={`${item.name}_${item.rank}`}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isCurrentPlayer
                    ? 'border-[#00E664] bg-[#00E664]/10 shadow-[0_0_15px_rgba(0,230,100,0.2)]'
                    : isDark
                    ? 'bg-black/40 border-white/10'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-sm border ${
                    item.rank === 1
                      ? 'bg-[#e2ff00] text-black border-black'
                      : item.rank === 2
                      ? 'bg-slate-300 text-black border-black'
                      : item.rank === 3
                      ? 'bg-orange-500 text-white border-black'
                      : 'bg-white/10 text-slate-400 border-white/20'
                  }`}>
                    {item.rank}
                  </div>
                  <div>
                    <div className="font-mono font-black text-sm flex items-center gap-2">
                      <span>{item.name}</span>
                      {isCurrentPlayer && <span className="text-[10px] bg-[#00E664] text-black px-1.5 py-0.5 rounded-full font-extrabold">YOU</span>}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{item.badge}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-right font-mono">
                  <Flame className="w-4 h-4 text-[#e63946] fill-[#e63946]" />
                  <span className="text-xl font-black text-[#e63946]">{item.streak}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">
          PLAY STILL ALIVE • GLOBAL RANKINGS
        </div>
      </div>
    </div>
  );
}
