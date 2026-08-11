import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const statusMessages = [
      'INITIALIZING STILL ALIVE ENGINE...',
      'CONNECTING TO SUPABASE DATABASE...',
      'PRELOADING HIGH-RES ASSETS...',
      'READY TO PLAY!',
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 500);
          }, 300);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 12;
        const msgIndex = Math.min(Math.floor((next / 100) * statusMessages.length), statusMessages.length - 1);
        setStatusText(statusMessages[msgIndex]);
        return Math.min(next, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-[#050508] transition-opacity duration-500 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#e63946]/20 via-amber-500/10 to-[#00E664]/20 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-4" />

      {/* FULL-SCREEN FOCAL LOGO ARTWORK */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-xl w-full text-center space-y-6 animate-pop">
        
        {/* Full-Screen High-Res Logo Container */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
          <div className="absolute inset-0 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl" />
          <img
            src="/PLAYSTILLALIVE.png"
            alt="PLAY STILL ALIVE Full Logo"
            className="relative w-full h-full object-contain p-6 transform-gpu transition-all duration-700 hover:scale-105 filter drop-shadow-[0_10px_25px_rgba(230,57,70,0.4)]"
          />
        </div>

      </div>

      {/* BOTTOM PROGRESS BAR OVERLAY */}
      <div className="relative z-10 w-full max-w-md space-y-3 text-center pb-4 sm:pb-8 animate-pop">
        <div className="w-full h-3 bg-black/80 rounded-full border border-white/15 overflow-hidden p-0.5 shadow-2xl">
          <div
            className="h-full bg-gradient-to-r from-[#e63946] via-amber-500 to-[#00E664] rounded-full transition-all duration-150 shadow-[0_0_12px_#00E664]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono px-1">
          <span className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">{statusText}</span>
          <span className="text-[#00E664] font-black text-sm font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
