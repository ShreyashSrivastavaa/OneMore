import React, { useEffect, useState } from 'react';

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
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-black transition-opacity duration-500 overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 100% TRUE FULL-SCREEN EDGE-TO-EDGE LOGO ARTWORK */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#fdfdfd] sm:bg-[#fafafa]">
        <img
          src="/PLAYSTILLALIVE.png"
          alt="PLAY STILL ALIVE Full Screen Logo"
          className="w-full h-full object-cover sm:object-contain transform-gpu scale-100 animate-pop transition-transform duration-700"
        />
      </div>

      {/* OVERLAY SLIM PROGRESS BAR AT BOTTOM EDGE */}
      <div className="relative z-20 w-full max-w-xl px-6 pb-6 mt-auto text-center space-y-2">
        <div className="w-full h-3.5 bg-black/80 backdrop-blur-md rounded-full border border-white/20 overflow-hidden p-0.5 shadow-2xl">
          <div
            className="h-full bg-gradient-to-r from-[#e63946] via-amber-500 to-[#00E664] rounded-full transition-all duration-150 shadow-[0_0_12px_#00E664]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono font-bold px-1 text-black sm:text-slate-900 bg-white/80 backdrop-blur-sm py-1 px-3 rounded-full border border-black/10">
          <span className="uppercase tracking-wider text-black font-extrabold animate-pulse">{statusText}</span>
          <span className="text-[#00c853] font-black text-sm font-mono">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
