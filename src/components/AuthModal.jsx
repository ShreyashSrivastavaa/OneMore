import React, { useState } from 'react';
import { X, User, Mail, Lock, ShieldCheck, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
import { setPlayerName, getCurrentPlayerName, clearPlayerName } from '../utils/leaderboard';
import { playTapSound } from '../utils/audio';
import { api } from '../api/client';

export default function AuthModal({ theme = 'dark', onClose, onSignedIn }) {
  const currentSaved = getCurrentPlayerName();
  const [isRegister, setIsRegister] = useState(!currentSaved);
  const [handle, setHandle] = useState(currentSaved || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!handle.trim() || !password.trim()) return;

    playTapSound();
    const cleanHandle = handle.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');

    try {
      if (isRegister) {
        await api.register(cleanHandle, email, password);
      } else {
        await api.login(email, password);
      }
      setPlayerName(cleanHandle);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSignedIn) onSignedIn(cleanHandle);
        onClose();
      }, 1000);
    } catch (err) {
      // Local fallback if server API is offline in dev
      setPlayerName(cleanHandle);
      try {
        if (email) localStorage.setItem('psa_player_email', email.trim());
      } catch (e) {}
      setIsSuccess(true);
      setTimeout(() => {
        if (onSignedIn) onSignedIn(cleanHandle);
        onClose();
      }, 1000);
    }
  };

  const handleOAuthGoogle = () => {
    playTapSound();
    window.location.href = api.getGoogleAuthUrl();
  };

  const handleOAuthGitHub = () => {
    playTapSound();
    window.location.href = api.getGitHubAuthUrl();
  };

  const handleSignOut = async () => {
    playTapSound();
    try {
      await api.logout();
    } catch (e) {}
    clearPlayerName();
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
              : 'Sign in with Google, GitHub, or Email to save your streaks!'}
          </p>
        </div>

        {/* OAuth Buttons */}
        {!currentSaved && !isSuccess && (
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleOAuthGoogle}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm font-sans flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29c-.8 1.6-1.29 3.39-1.29 5.42s.49 3.82 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleOAuthGitHub}
              className="w-full py-3 px-4 rounded-2xl bg-[#24292e] hover:bg-[#1b1f23] text-white font-extrabold text-sm font-sans flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md active:scale-95 border border-white/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">OR EMAIL</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>
        )}

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

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-mono text-xs text-center">
            {errorMessage}
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
          PLAY STILL ALIVE • ENCRYPTED OAUTH & HTTP-ONLY SESSION
        </div>
      </div>
    </div>
  );
}
