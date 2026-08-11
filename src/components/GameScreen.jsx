import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { playTapSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { getCategoryTheme } from '../utils/images';

export default function GameScreen({
  question,
  currentStreak,
  theme = 'dark',
  onGuess
}) {
  const [revealed, setRevealed] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const isDark = theme === 'dark';

  // Reset local reveal state when new question arrives
  useEffect(() => {
    setRevealed(false);
    setUserChoice(null);
    setIsCorrect(null);
  }, [question?.id]);

  const handleUserChoice = (choice) => {
    if (revealed) return;

    // 1. Instant 0ms Visual & Audio Feedback
    playTapSound();
    setUserChoice(choice);
    setRevealed(true);

    // 2. Concurrently execute answer check in background
    onGuess(choice).then((result) => {
      const userIsRight = typeof result === 'boolean' ? result : result?.correct;
      setIsCorrect(userIsRight);
      if (userIsRight) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    });
  };

  return (
    <div className={`relative w-full min-h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden transition-colors ${
      isDark ? 'bg-portfolio-dark text-[#f4e4d0]' : 'bg-portfolio-light text-slate-900'
    } ${revealed && isCorrect ? 'ring-4 sm:ring-6 ring-[#00E664] transition-all' : ''} ${
      revealed && !isCorrect ? 'animate-shake-hard ring-4 sm:ring-6 ring-[#e63946]' : ''
    }`}>

      {/* Header Spacer */}
      <div className="h-16 sm:h-20" />

      {/* Focal Question & Category Pill */}
      <div className="relative z-10 w-full max-w-xl text-center space-y-3 my-auto animate-pop px-2">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono tracking-wider uppercase ${
          isDark ? 'glass-pill-dark text-slate-300' : 'glass-pill-light text-slate-700'
        }`}>
          <span>{question.category} • {question.formatType ? question.formatType.replace('_', ' ') : 'QUESTION'}</span>
          <span className="opacity-40">•</span>
          <span className="text-[10px] text-[#e63946] font-bold">AS OF {question.dataAsOf || 'AUG 2026'}</span>
        </div>

        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans ${
          isDark ? 'text-[#f4e4d0]' : 'text-slate-900'
        }`}>
          {question.prompt}
        </h2>
      </div>

      {/* RENDER LAYOUT BASED ON ROUND FORMAT */}

      {/* FORMAT 1 & 3: PICK WINNER OR TIMELINE (2-OPTION BATTLE) */}
      {(question.formatType === 'PICK_WINNER' || question.formatType === 'TIMELINE' || !question.formatType) && (
        <div className="relative z-10 my-auto w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-2">
          
          {/* CARD A */}
          <div
            onClick={() => handleUserChoice('A')}
            className={`group relative rounded-3xl border p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center text-center transition-all cursor-pointer transform-gpu ${
              isDark ? 'glass-pill-dark hover:border-[#e63946]' : 'glass-pill-light hover:border-black'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'A' ? (isCorrect !== false ? 'ring-2 ring-[#00E664]' : 'ring-2 ring-[#e63946]') : ''
            }`}
          >
            <div className="space-y-4 w-full">
              <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-tight">
                “{question.entityA}”
              </div>

              {!revealed ? (
                <div className="inline-block py-3 px-6 rounded-full btn-portfolio-red font-extrabold text-base sm:text-lg font-mono tracking-wider uppercase mt-1">
                  TAP TO CHOOSE
                </div>
              ) : (
                <div className="animate-pop space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#00E664]">
                    {question.displayA || question.yearA || '✓'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD B */}
          <div
            onClick={() => handleUserChoice('B')}
            className={`group relative rounded-3xl border p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center text-center transition-all cursor-pointer transform-gpu ${
              isDark ? 'glass-pill-dark hover:border-[#e63946]' : 'glass-pill-light hover:border-black'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'B' ? (isCorrect !== false ? 'ring-2 ring-[#00E664]' : 'ring-2 ring-[#e63946]') : ''
            }`}
          >
            <div className="space-y-4 w-full">
              <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-tight">
                “{question.entityB}”
              </div>

              {!revealed ? (
                <div className="inline-block py-3 px-6 rounded-full btn-portfolio-red font-extrabold text-base sm:text-lg font-mono tracking-wider uppercase mt-1">
                  TAP TO CHOOSE
                </div>
              ) : (
                <div className="animate-pop space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#00E664]">
                    {question.displayB || question.yearB || '✓'}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* FORMAT 2: OVER / UNDER DECISION CARD */}
      {question.formatType === 'OVER_UNDER' && (
        <div className="relative z-10 my-auto w-full max-w-xl space-y-6 px-2">
          <div className={`rounded-3xl border p-6 sm:p-8 text-center space-y-4 shadow-xl ${
            isDark ? 'glass-pill-dark' : 'glass-pill-light'
          }`}>
            <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-tight text-[#e63946]">
              “{question.entityA}”
            </div>

            {revealed && (
              <div className="animate-pop pt-2 text-2xl sm:text-4xl font-black text-[#00E664]">
                ACTUAL: {question.displayA || question.valueA}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleUserChoice('OVER')}
              disabled={revealed}
              className={`py-5 px-6 rounded-2xl bg-[#00E664] hover:bg-[#00c853] text-black font-black text-xl font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg transform-gpu ${
                revealed && userChoice === 'OVER' ? (isCorrect !== false ? 'ring-4 ring-white' : 'opacity-50 line-through') : ''
              }`}
            >
              <ArrowUp className="w-6 h-6 stroke-[3]" />
              <span>OVER ↑</span>
            </button>

            <button
              onClick={() => handleUserChoice('UNDER')}
              disabled={revealed}
              className={`py-5 px-6 rounded-2xl bg-[#e63946] hover:bg-[#d62828] text-white font-black text-xl font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg transform-gpu ${
                revealed && userChoice === 'UNDER' ? (isCorrect !== false ? 'ring-4 ring-white' : 'opacity-50 line-through') : ''
              }`}
            >
              <ArrowDown className="w-6 h-6 stroke-[3]" />
              <span>UNDER ↓</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Spacer */}
      <div className="h-6 sm:h-8" />
    </div>
  );
}
