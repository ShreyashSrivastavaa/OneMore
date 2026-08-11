import React, { useEffect, useState } from 'react';
import { ShieldCheck, Flame } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING ENGINE...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const statusMessages = [
      'INITIALIZING STILL ALIVE ENGINE...',
      'CONNECTING TO SUPABASE DATABASE...',
      'PRELOADING GRAPH ASSETS...',
      'READY TO STAY ALIVE!',
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
        const next = prev + Math.floor(Math.random() * 15) + 10;
        const msgIndex = Math.min(Math.floor((next / 100) * statusMessages.length), statusMessages.length - 1);
        setStatusText(statusMessages[msgIndex]);
        return Math.min(next, 100);
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#050508] text-[#f4e4d0] transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Spacer */}
      <div className="h-10" />

      {/* Center Preloader Content */}
      <div className="relative flex flex-col items-center max-w-md w-full text-center space-y-6 animate-pop">
        
        {/* Glow Halo around Logo */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#e63946] via-[#00E664] to-[#e63946] rounded-full blur-xl opacity-50 animate-pulse" />
          <img
            src="/PLAYSTILLALIVE.png"
            alt="PLAY STILL ALIVE Logo"
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-3xl border-2 border-white/20 shadow-2xl"
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase font-sans">
            PLAY <span className="text-stroke-sand">STILL</span> <span className="text-[#e63946]">ALIVE</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            HANDCRAFTED TRIVIA GAME ENGINE
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2 pt-2">
          <div className="w-full h-3 bg-black/60 rounded-full border border-white/10 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#e63946] via-amber-500 to-[#00E664] rounded-full transition-all duration-150 shadow-[0_0_12px_#00E664]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 tracking-wider font-bold animate-pulse">{statusText}</span>
            <span className="text-[#00E664] font-black text-sm">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer System Attribution */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-4">
        <Flame className="w-3.5 h-3.5 text-[#e63946] fill-[#e63946]" />
        <span>PLAY STILL ALIVE • V2.0 PRODUCTION ENGINE</span>
      </div>
    </div>
  );
}
