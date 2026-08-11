import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Share2, Check, Sparkles, LogIn, Lock } from 'lucide-react';
import { playTapSound, playHighScoreFanfare } from '../utils/audio';
import { getLeaderboard, getCurrentPlayerName, submitScoreToLeaderboard } from '../utils/leaderboard';

export default function ResultWrongScreen({
  question,
  finalStreak,
  bestStreak,
  isNewBest,
  theme = 'dark',
  onPlayAgain,
  onOpenLeaderboard,
  onOpenAuth
}) {
  const currentPlayer = getCurrentPlayerName();
  const [handleInput, setHandleInput] = useState(currentPlayer || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isNewBest && finalStreak > 0) {
      playHighScoreFanfare();
      import('canvas-confetti').then((confettiModule) => {
        try {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.55 }
          });
        } catch (e) {}
      }).catch(() => {});
    }
  }, [isNewBest, finalStreak]);

  const handleSubmitScore = (e) => {
    e.preventDefault();
    if (!currentPlayer && !handleInput.trim()) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    playTapSound();
    const nameToSubmit = currentPlayer || handleInput;
    const updated = submitScoreToLeaderboard(nameToSubmit, finalStreak);
    setLeaderboard(updated);
    setIsSubmitted(true);
  };

  const handleShare = () => {
    playTapSound();
    const text = `🔥 PLAY STILL ALIVE\nI kept my streak alive for ${finalStreak} rounds!\nBest Streak: ${bestStreak}\nCan you beat my run?\nPlay now: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({ title: 'PLAY STILL ALIVE', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleRestart = () => {
    playTapSound();
    onPlayAgain();
  };

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-between p-4 sm:p-6 text-center overflow-hidden transition-colors ${
      isDark ? 'bg-portfolio-dark text-[#f4e4d0]' : 'bg-portfolio-light text-slate-900'
    }`}>
      {/* Header Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Main Content */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-lg w-full space-y-4 animate-pop px-2">
        
        {/* Wrong Banner Stamp */}
        <div className="inline-block bg-[#e63946] text-white font-black text-3xl sm:text-5xl font-mono px-6 py-2 rounded-full border border-white/20 shadow-xl uppercase tracking-tight transform -rotate-1">
          YOU'RE OUT
        </div>

        {/* Fact Breakdown */}
        <div className="space-y-1">
          <p className={`font-bold text-base sm:text-xl ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            “<span className="font-black">{question.entityB}</span>” has{' '}
            <span className="text-[#e63946] font-mono font-black text-xl sm:text-2xl">
              {question.displayB}
            </span>
          </p>
          <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            vs “{question.entityA}” ({question.displayA})
          </p>
        </div>

        {/* New Best Record Banner */}
        {isNewBest && finalStreak > 0 && (
          <div className="w-full rounded-full bg-[#00E664] text-black font-black font-mono text-xs sm:text-sm py-2.5 px-4 border border-black shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            <span>NEW HIGH SCORE RECORD!</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
          </div>
        )}

        {/* 1. FINAL LEAGUE TABLE DROPDOWN BAR */}
        <div className="w-full">
          <button
            onClick={() => {
              playTapSound();
              setShowTable(!showTable);
            }}
            className={`w-full py-3 px-5 rounded-2xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
              isDark ? 'bg-black/70 border-white/15 text-slate-300 hover:border-white/30' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <span>FINAL LEAGUE TABLE</span>
            {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Expandable Leaderboard Table */}
          {showTable && (
            <div className={`mt-2 rounded-2xl border p-4 space-y-2 text-left animate-pop ${
              isDark ? 'glass-pill-dark' : 'glass-pill-light'
            }`}>
              {leaderboard.slice(0, 5).map((item) => (
                <div key={item.rank} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#e2ff00]">#{item.rank}</span>
                    <span className="font-black">{item.name}</span>
                  </div>
                  <span className="font-black text-[#e63946]">🔥 {item.streak}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. LEADERBOARD SUBMISSION CARD (AUTH ENFORCED) */}
        <div className={`w-full rounded-2xl border p-5 space-y-3 text-left transition-all ${
          isDark ? 'bg-[#0f1015] border-white/15' : 'bg-white border-slate-300'
        }`}>
          <div className="space-y-1">
            <h3 className={`text-base sm:text-lg font-black font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Add this run to the leaderboard
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Pick a handle and compare your streak against everyone else.
            </p>

            {/* Status note based on Auth state */}
            {currentPlayer ? (
              <div className="text-xs font-mono font-bold text-[#e2ff00] pt-1">
                {isSubmitted
                  ? '✓ Added to global leaderboard!'
                  : `Signed in as @${currentPlayer}. Tap Submit to add it.`}
              </div>
            ) : (
              <div className="text-xs font-mono font-bold text-[#e63946] flex items-center gap-1 pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>You must sign in before submitting to the leaderboard.</span>
              </div>
            )}
          </div>

          {/* Form OR Sign In CTA Button */}
          {currentPlayer ? (
            <form onSubmit={handleSubmitScore} className="flex gap-2 pt-1">
              <input
                type="text"
                disabled
                value={`@${currentPlayer}`}
                className={`flex-1 px-4 py-3 rounded-xl border font-mono text-sm font-bold outline-none cursor-not-allowed opacity-80 ${
                  isDark ? 'bg-black/60 border-white/20 text-[#00E664]' : 'bg-slate-100 border-slate-300 text-black'
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitted}
                className="px-6 py-3 rounded-xl bg-[#00E664] hover:bg-[#00c853] text-black font-black font-sans text-sm uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitted ? 'Added!' : 'Submit'}
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                playTapSound();
                if (onOpenAuth) onOpenAuth();
              }}
              className="w-full py-3.5 px-6 rounded-xl btn-portfolio-red text-white font-black font-sans text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN TO SUBMIT RUN</span>
            </button>
          )}
        </div>

        {/* 3. ACTION BUTTON BAR: SHARE & NEW RUN */}
        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`py-3.5 px-4 rounded-2xl border font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              isDark ? 'bg-[#15161c] border-white/20 text-white hover:border-white/40' : 'bg-slate-200 border-slate-300 text-black'
            }`}
          >
            {copiedShare ? <Check className="w-4 h-4 text-[#00E664]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied!' : '📸 Share'}</span>
          </button>

          {/* New Run Button */}
          <button
            onClick={handleRestart}
            className="py-3.5 px-4 rounded-2xl bg-[#00E664] hover:bg-[#00c853] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg"
          >
            <span>New Run</span>
          </button>
        </div>

      </div>

      {/* Bottom spacer */}
      <div className="relative z-10 w-full max-w-md pb-4 font-mono text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
        PLAY STILL ALIVE • TACTILE TRIVIA GAME
      </div>
    </div>
  );
}
