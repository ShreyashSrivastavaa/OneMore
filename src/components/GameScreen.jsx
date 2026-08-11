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
  const [selectedGuess, setSelectedGuess] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

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

    // Fast 650ms transition
    setTimeout(() => {
      onGuess(userIsRight);
    }, 650);
  };

  const imageA = getEntityImage(question.entityA, question.category);
  const imageB = getEntityImage(question.entityB, question.category);

  return (
    <div className={`relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-[#0c0d0e] ${
      revealed && isCorrect ? 'ring-8 ring-[#00E664] transition-all' : ''
    } ${revealed && !isCorrect ? 'animate-shake-hard ring-8 ring-[#FF3333]' : ''}`}>
      
      {/* OPTION A - LEFT HALF */}
      <div className="relative flex-1 min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center p-6 text-center border-b-4 md:border-b-0 md:border-r-4 border-black">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: `url(${imageA})` }}
        />
        <div className="absolute inset-0 bg-[#0c0d0e]/75" />

        {/* Content A */}
        <div className="relative z-10 max-w-md space-y-3 animate-pop">
          <span className="inline-block px-3 py-1 bg-black text-[#E2FF00] font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#E2FF00] uppercase tracking-wider">
            {question.category}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            “{question.entityA}”
          </h2>

          <p className="text-slate-400 font-mono text-sm font-bold uppercase tracking-widest">
            has
          </p>

          <div className="text-4xl sm:text-6xl font-black text-[#E2FF00] font-mono tracking-tight my-2 drop-shadow-lg bg-black/60 px-4 py-2 border-2 border-black inline-block">
            {question.displayA}
          </div>

          <p className="text-slate-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            {question.metric}
          </p>
        </div>
      </div>

      {/* CENTER VS STAMP BADGE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E2FF00] text-black font-black text-xl sm:text-2xl font-mono flex items-center justify-center border-4 border-black shadow-[5px_5px_0px_0px_#000] transform rotate-6">
          VS
        </div>
      </div>

      {/* OPTION B - RIGHT HALF */}
      <div className="relative flex-1 min-h-[50vh] md:min-h-screen flex flex-col items-center justify-center p-6 text-center">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: `url(${imageB})` }}
        />
        <div className="absolute inset-0 bg-[#0c0d0e]/75" />

        {/* Content B */}
        <div className="relative z-10 max-w-md space-y-3 w-full px-4 animate-pop">
          <span className="inline-block px-3 py-1 bg-black text-[#E2FF00] font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#E2FF00] uppercase tracking-wider">
            {question.category}
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            “{question.entityB}”
          </h2>

          <p className="text-slate-400 font-mono text-sm font-bold uppercase tracking-widest">
            has
          </p>

          {!revealed ? (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center gap-3.5 w-full max-w-xs mx-auto">
                {/* MORE BUTTON */}
                <button
                  onClick={() => handleGuess('HIGHER')}
                  className="w-full py-4 px-6 brutal-btn-yellow font-black text-2xl sm:text-3xl tracking-wider flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>MORE</span>
                  <ArrowUp className="w-7 h-7 stroke-[3] group-hover:-translate-y-1 transition-transform" />
                </button>

                {/* LESS BUTTON */}
                <button
                  onClick={() => handleGuess('LOWER')}
                  className="w-full py-4 px-6 brutal-btn font-black text-2xl sm:text-3xl tracking-wider flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>LESS</span>
                  <ArrowDown className="w-7 h-7 stroke-[3] group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase pt-1">
                {question.metric} THAN {question.entityA}
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-pop">
              <div className="text-4xl sm:text-6xl font-black text-[#E2FF00] font-mono tracking-tight my-2 drop-shadow-lg bg-black/60 px-4 py-2 border-2 border-black inline-block">
                {question.displayB}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
                {question.metric}
              </p>

              {/* Correct/Wrong Feedback Stamp */}
              <div className="pt-2 flex justify-center">
                {isCorrect ? (
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00E664] text-black font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_#000] transform -rotate-1">
                    <Check className="w-6 h-6 stroke-[3]" />
                    <span>CORRECT!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF3333] text-white font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_#000] transform rotate-1">
                    <X className="w-6 h-6 stroke-[3]" />
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
