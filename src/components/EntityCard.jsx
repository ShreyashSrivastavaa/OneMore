import React from 'react';
import { HelpCircle, Check, X } from 'lucide-react';

export default function EntityCard({
  entityName,
  displayValue,
  category,
  metric,
  isRevealed,
  isSelected,
  isCorrect,
  isWrong,
  onTap,
  isCardB = false
}) {
  let borderStyle = 'border-slate-700/80 bg-slate-800/80';
  let badgeStyle = null;

  if (isRevealed) {
    if (isCorrect) {
      borderStyle = 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50';
      badgeStyle = (
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg animate-pop-in">
          <Check className="w-3.5 h-3.5 stroke-[3]" /> CORRECT
        </div>
      );
    } else if (isWrong) {
      borderStyle = 'border-red-500 bg-red-950/40 ring-2 ring-red-500/50 animate-shake';
      badgeStyle = (
        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg animate-pop-in">
          <X className="w-3.5 h-3.5 stroke-[3]" /> WRONG
        </div>
      );
    }
  }

  return (
    <div
      onClick={onTap && !isRevealed ? onTap : undefined}
      className={`relative w-full rounded-2xl p-5 border transition-all duration-300 flex flex-col items-center justify-center text-center ${borderStyle} ${
        onTap && !isRevealed ? 'cursor-pointer hover:border-amber-400/60 active:scale-[0.98]' : ''
      }`}
    >
      {badgeStyle}

      {/* Category & Metric tag */}
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-slate-700">
        {category} • {metric}
      </span>

      {/* Entity Name */}
      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight my-1 line-clamp-2">
        {entityName}
      </h3>

      {/* Display Value */}
      <div className="mt-2 min-h-[3rem] flex items-center justify-center">
        {isRevealed || !isCardB ? (
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight animate-pop-in">
            {displayValue}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900/80 text-slate-400 font-bold font-mono text-lg border border-slate-700">
            <HelpCircle className="w-5 h-5 text-amber-400/80 animate-pulse" />
            <span>???</span>
          </div>
        )}
      </div>
    </div>
  );
}
