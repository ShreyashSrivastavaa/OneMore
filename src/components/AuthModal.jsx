import React, { useState } from 'react';
import { X, User, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { setPlayerName, getCurrentPlayerName } from '../utils/leaderboard';
import { playTapSound } from '../utils/audio';

export default function AuthModal({ theme = 'dark', onClose, onSignedIn }) {
  const [handle, setHandle] = useState(getCurrentPlayerName() || '');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    playTapSound();
    const cleanHandle = handle.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setPlayerName(cleanHandle);
    
    // Save email in localStorage for account linking
    try {
      if (email) localStorage.setItem('psa_player_email', email.trim());
    } catch (err) {}

    setIsSuccess(true);

    setTimeout(() => {
      if (onSignedIn) onSignedIn(cleanHandle);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop">
      <div className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl ${
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wider uppercase text-[#00E664] border-[#00E664]/30 bg-[#00E664]/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PLAYER SIGN-IN</span>
          </div>
          <h2 className="text-3xl font-black font-sans tracking-tight">SIGN IN TO LEADERBOARD</h2>
          <p className="text-xs font-mono text-slate-400">Link your handle to upload streaks & claim global ranks!</p>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-[#00E664]/20 border border-[#00E664] text-[#00E664] font-mono text-sm font-bold text-center animate-pop space-y-1">
            <div className="text-base font-black">✓ SIGNED IN SUCCESSFULLY!</div>
            <div className="text-xs opacity-90">Account linked as @{handle.toUpperCase()}</div>
          </div>
        ) : (
          /* Sign-In Form */
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#e63946]" />
                <span>Player Handle / Username *</span>
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. SHREYASH017"
                maxLength={15}
                className={`w-full px-4 py-3 rounded-2xl border font-mono text-sm font-bold uppercase outline-none transition-all ${
                  isDark ? 'bg-black/60 border-white/20 text-white focus:border-[#00E664]' : 'bg-slate-100 border-slate-300 text-black'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Optional for Recovery)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className={`w-full px-4 py-3 rounded-2xl border font-mono text-sm font-bold outline-none transition-all ${
                  isDark ? 'bg-black/60 border-white/20 text-white focus:border-[#00E664]' : 'bg-slate-100 border-slate-300 text-black'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#00E664] hover:bg-[#00c853] text-black font-black font-sans text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg pt-3"
            >
              <span>SIGN IN & LINK ACCOUNT</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">
          PLAY STILL ALIVE • SECURE ACCOUNT LINK
        </div>
      </div>
    </div>
  );
}
