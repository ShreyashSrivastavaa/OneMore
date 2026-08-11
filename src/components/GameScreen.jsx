import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { getEntityImage } from '../utils/images';
import { playTapSound, playCorrectSound, playWrongSound } from '../utils/audio';

export default function GameScreen({
  question,
  currentStreak,
  onGuess
}) {
  const [revealed, setRevealed] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState(null); // 'HIGHER' or 'LOWER'
  const [isCorrect, setIsCorrect] = useState(null);

  // Determine if B's actual numeric value is higher than A
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

    // Fast 600ms reveal transition to next question or game over screen
    setTimeout(() => {
      onGuess(userIsRight);
    }, 650);
  };

  const imageA = getEntityImage(question.entityA, question.category);
  const imageB = getEntityImage(question.entityB, question.category);

  return (
    <div className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950 selection:bg-amber-400">
      
      {/* LEFT HALF - ENTITY A */}
      <div className="relative flex-1 min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Image & Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: `url(${imageA})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50 backdrop-blur-[1px]" />

        {/* Entity A Content */}
        <div className="relative z-10 max-w-md space-y-2 animate-pop-in">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg font-sans">
            “{question.entityA}”
          </h2>
          <p className="text-slate-300 font-semibold text-lg sm:text-xl uppercase tracking-wider">
            has
          </p>
          <div className="text-4xl sm:text-6xl font-black text-yellow-400 font-mono tracking-tight drop-shadow-xl my-2">
            {question.displayA}
          </div>
          <p className="text-slate-200 text-sm sm:text-base font-bold uppercase tracking-widest opacity-90">
            {question.metric}
          </p>
        </div>
      </div>

      {/* CENTER VS CIRCULAR BADGE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-2xl border-4 border-slate-950 animate-pulse-glow">
          VS
        </div>
      </div>

      {/* RIGHT HALF - ENTITY B */}
      <div className="relative flex-1 min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Image & Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: `url(${imageB})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50 backdrop-blur-[1px]" />

        {/* Entity B Content */}
        <div className="relative z-10 max-w-md space-y-3 w-full px-4 animate-pop-in">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg font-sans">
            “{question.entityB}”
          </h2>
          <p className="text-slate-300 font-semibold text-lg sm:text-xl uppercase tracking-wider">
            has
          </p>

          {/* Interactive Choices or Revealed Value */}
          {!revealed ? (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
                {/* MORE BUTTON */}
                <button
                  onClick={() => handleGuess('HIGHER')}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border-2 border-white/80 text-white font-black text-xl sm:text-2xl tracking-wider flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
                >
                  <span>MORE</span>
                  <ArrowUp className="w-6 h-6 stroke-[3] group-hover:-translate-y-1 transition-transform" />
                </button>

                {/* LESS BUTTON */}
                <button
                  onClick={() => handleGuess('LOWER')}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border-2 border-white/80 text-white font-black text-xl sm:text-2xl tracking-wider flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
                >
                  <span>LESS</span>
                  <ArrowDown className="w-6 h-6 stroke-[3] group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-semibold tracking-wider uppercase opacity-80 pt-1">
                {question.metric} than {question.entityA}
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-pop-in">
              <div className="text-4xl sm:text-6xl font-black text-yellow-400 font-mono tracking-tight drop-shadow-xl my-2">
                {question.displayB}
              </div>
              <p className="text-slate-200 text-sm sm:text-base font-bold uppercase tracking-widest opacity-90">
                {question.metric}
              </p>

              {/* Reveal Result Badge */}
              <div className="pt-2 flex justify-center">
                {isCorrect ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-black text-base shadow-2xl animate-pop-in">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>CORRECT!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white font-black text-base shadow-2xl animate-shake">
                    <X className="w-5 h-5 stroke-[3]" />
                    <span>WRONG!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
