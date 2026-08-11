import React, { useState, useEffect } from 'react';
import EntityCard from './EntityCard';
import { ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import { playTapSound, playCorrectSound, playWrongSound } from '../utils/audio';

export default function GameScreen({
  question,
  currentStreak,
  onGuess
}) {
  const [revealed, setRevealed] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState(null); // 'HIGHER' or 'LOWER'
  const [isCorrect, setIsCorrect] = useState(null);

  // Question details
  // Note: question.valueB vs question.valueA
  // Is B higher than A?
  const bIsHigher = question.valueB >= question.valueA;

  const handleGuess = (guess) => {
    if (revealed) return;

    playTapSound();
    setSelectedGuess(guess);
    setRevealed(true);

    const userIsRight = (guess === 'HIGHER' && bIsHigher) || (guess === 'LOWER' && !bIsHigher);
    setIsCorrect(userIsRight);

    if (userIsRight) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    // Wait ~500ms for reveal feedback animation, then trigger result callback
    setTimeout(() => {
      onGuess(userIsRight);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-4 py-3 animate-pop-in">
      {/* Question Header */}
      <div className="w-full text-center space-y-1 mb-2">
        <h2 className="text-xl sm:text-2xl font-black text-white leading-snug font-sans">
          Which has more {question.category.toLowerCase() === 'geography' || question.category.toLowerCase() === 'science' ? '' : question.category}{' '}
          <span className="text-amber-400 font-extrabold underline decoration-amber-500/50 underline-offset-4">
            {question.metric.toLowerCase()}
          </span>?
        </h2>
      </div>

      {/* Comparison Cards Section */}
      <div className="w-full flex-1 flex flex-col justify-center gap-3 my-auto">
        {/* Entity A */}
        <EntityCard
          entityName={question.entityA}
          displayValue={question.displayA}
          category={question.category}
          metric={question.metric}
          isRevealed={true}
          isCardB={false}
        />

        {/* OR / VS Divider */}
        <div className="relative flex items-center justify-center my-[-6px] z-10">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-black text-xs tracking-widest shadow-md">
            OR
          </div>
        </div>

        {/* Entity B */}
        <EntityCard
          entityName={question.entityB}
          displayValue={question.displayB}
          category={question.category}
          metric={question.metric}
          isRevealed={revealed}
          isCardB={true}
          isCorrect={revealed && isCorrect}
          isWrong={revealed && !isCorrect}
          onTap={() => handleGuess('HIGHER')}
        />
      </div>

      {/* Action Buttons: HIGHER / LOWER */}
      <div className="w-full pt-3 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleGuess('HIGHER')}
            disabled={revealed}
            className={`py-4 px-3 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all duration-150 cursor-pointer ${
              revealed && selectedGuess === 'HIGHER'
                ? isCorrect
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50 scale-95'
                  : 'bg-red-500 text-white ring-4 ring-red-400/50 scale-95'
                : 'bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-slate-950 shadow-emerald-500/20'
            } ${revealed && selectedGuess !== 'HIGHER' ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <ArrowUpRight className="w-6 h-6 stroke-[3]" />
            <span>HIGHER</span>
          </button>

          <button
            onClick={() => handleGuess('LOWER')}
            disabled={revealed}
            className={`py-4 px-3 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all duration-150 cursor-pointer ${
              revealed && selectedGuess === 'LOWER'
                ? isCorrect
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50 scale-95'
                  : 'bg-red-500 text-white ring-4 ring-red-400/50 scale-95'
                : 'bg-red-500 hover:bg-red-400 active:scale-[0.97] text-white shadow-red-500/20'
            } ${revealed && selectedGuess !== 'LOWER' ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <ArrowDownRight className="w-6 h-6 stroke-[3]" />
            <span>LOWER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
