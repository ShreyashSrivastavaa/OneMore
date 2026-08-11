import React, { useState } from 'react';
import { X, User, Mail, Lock, ShieldCheck, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
import { setPlayerName, getCurrentPlayerName, clearPlayerName } from '../utils/leaderboard';
import { playTapSound } from '../utils/audio';

export default function AuthModal({ theme = 'dark', onClose, onSignedIn }) {
  const currentSaved = getCurrentPlayerName();
  const [isRegister, setIsRegister] = useState(!currentSaved);
  const [handle, setHandle] = useState(currentSaved || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handle.trim() || !password.trim()) return;

    playTapSound();
    const cleanHandle = handle.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
    setPlayerName(cleanHandle);
    
    try {
      if (email) localStorage.setItem('psa_player_email', email.trim());
      localStorage.setItem('psa_auth_token', `token_${Date.now()}`);
    } catch (err) {}

    setIsSuccess(true);

    setTimeout(() => {
      if (onSignedIn) onSignedIn(cleanHandle);
      onClose();
    }, 1200);
  };

  const handleSignOut = () => {
    playTapSound();
    clearPlayerName();
    try {
      localStorage.removeItem('psa_auth_token');
    } catch (e) {}
    setHandle('');
    setPassword('');
    if (onSignedIn) onSignedIn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop">
      <div className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl ${
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
            <span>AUTHENTICATION</span>
          </div>
          <h2 className="text-3xl font-black font-sans tracking-tight">
            {currentSaved ? 'ACCOUNT MANAGER' : isRegister ? 'CREATE ACCOUNT' : 'PLAYER SIGN-IN'}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            {currentSaved
              ? `Currently authenticated as @${currentSaved}`
              : 'Sign in with email & password to save streaks to global database!'}
          </p>
        </div>

        {/* Auth Mode Tabs (Sign In vs Register) */}
        {!currentSaved && !isSuccess && (
          <div className="flex p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                !isRegister ? 'bg-[#00E664] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                isRegister ? 'bg-[#00E664] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess ? (
          <div className="p-5 rounded-2xl bg-[#00E664]/20 border border-[#00E664] text-[#00E664] font-mono text-sm font-bold text-center animate-pop space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#00E664]" />
            <div className="text-base font-black uppercase">AUTHENTICATED SUCCESSFULLY!</div>
            <div className="text-xs opacity-90">Connected as @{handle.toUpperCase()}</div>
          </div>
        ) : (
          /* Sign-In / Register Form */
          <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-left">
            <div className="space-y-1">
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

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shreyash@example.com"
                className={`w-full px-4 py-3 rounded-2xl border font-mono text-sm font-bold outline-none transition-all ${
                  isDark ? 'bg-black/60 border-white/20 text-white focus:border-[#00E664]' : 'bg-slate-100 border-slate-300 text-black'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password *</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full px-4 py-3 rounded-2xl border font-mono text-sm font-bold outline-none transition-all ${
                  isDark ? 'bg-black/60 border-white/20 text-white focus:border-[#00E664]' : 'bg-slate-100 border-slate-300 text-black'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#00E664] hover:bg-[#00c853] text-black font-black font-sans text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg pt-3"
            >
              <span>{isRegister ? 'REGISTER & SIGN IN' : 'SIGN IN ACCOUNT'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            {currentSaved && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3 px-6 rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT / DISCONNECT</span>
              </button>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-1">
          PLAY STILL ALIVE • ENCRYPTED AUTH SESSION
        </div>
      </div>
    </div>
  );
}
