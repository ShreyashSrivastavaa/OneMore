import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X, Flame } from 'lucide-react';
import { playTapSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { ROUND_FORMATS } from '../utils/formatters';
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

  const categoryTheme = getCategoryTheme(question.category);
  const isDark = theme === 'dark';

  const handleUserChoice = (choice) => {
    if (revealed) return;

    playTapSound();
    setUserChoice(choice);
    setRevealed(true);

    let userIsRight = false;

    if (question.formatType === ROUND_FORMATS.PICK_WINNER) {
      userIsRight = (choice === 'A' && question.aIsBigger) || (choice === 'B' && !question.aIsBigger);
    } else if (question.formatType === ROUND_FORMATS.TIMELINE) {
      userIsRight = (choice === 'A' && question.aIsEarlier) || (choice === 'B' && !question.aIsEarlier);
    } else if (question.formatType === ROUND_FORMATS.OVER_UNDER) {
      userIsRight = (choice === 'OVER' && question.isOver) || (choice === 'UNDER' && !question.isOver);
    }

    setIsCorrect(userIsRight);

    if (userIsRight) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      onGuess(userIsRight);
    }, 600);
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
          <span>{categoryTheme.icon}</span>
          <span>{question.category} • {question.formatType.replace('_', ' ')}</span>
        </div>

        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight font-sans ${
          isDark ? 'text-[#f4e4d0]' : 'text-slate-900'
        }`}>
          {question.prompt}
        </h2>
      </div>

      {/* RENDER LAYOUT BASED ON ROUND FORMAT */}

      {/* FORMAT 1 & 3: PICK WINNER OR TIMELINE (2-OPTION BATTLE) */}
      {(question.formatType === ROUND_FORMATS.PICK_WINNER || question.formatType === ROUND_FORMATS.TIMELINE) && (
        <div className="relative z-10 my-auto w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-2">
          
          {/* CARD A */}
          <div
            onClick={() => handleUserChoice('A')}
            className={`group relative rounded-3xl border p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDark ? 'glass-pill-dark hover:border-[#e63946]' : 'glass-pill-light hover:border-black'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'A' ? (isCorrect ? 'ring-2 ring-[#00E664]' : 'ring-2 ring-[#e63946]') : ''
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
                <div className="space-y-1 animate-pop">
                  <div className="text-2xl sm:text-4xl font-black text-[#e63946] font-mono bg-black/80 px-4 py-2 border border-white/20 rounded-full inline-block">
                    {question.displayA}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {question.formatType === ROUND_FORMATS.TIMELINE ? 'YEAR RELEASED' : question.metric}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD B */}
          <div
            onClick={() => handleUserChoice('B')}
            className={`group relative rounded-3xl border p-6 sm:p-8 min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDark ? 'glass-pill-dark hover:border-[#e63946]' : 'glass-pill-light hover:border-black'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'B' ? (isCorrect ? 'ring-2 ring-[#00E664]' : 'ring-2 ring-[#e63946]') : ''
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
                <div className="space-y-1 animate-pop">
                  <div className="text-2xl sm:text-4xl font-black text-[#e63946] font-mono bg-black/80 px-4 py-2 border border-white/20 rounded-full inline-block">
                    {question.displayB}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    {question.formatType === ROUND_FORMATS.TIMELINE ? 'YEAR RELEASED' : question.metric}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORMAT 2: OVER / UNDER THRESHOLD CHALLENGE */}
      {question.formatType === ROUND_FORMATS.OVER_UNDER && (
        <div className="relative z-10 my-auto w-full max-w-lg space-y-5 px-3">
          
          {/* Main Threshold Entity Card */}
          <div className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col items-center justify-center text-center ${
            isDark ? 'glass-pill-dark' : 'glass-pill-light'
          }`}>
            <div className="space-y-3 w-full">
              <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-tight">
                “{question.entityA}”
              </div>

              <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                TARGET THRESHOLD
              </div>

              <div className="text-3xl sm:text-5xl font-black text-[#f4e4d0] font-mono bg-black/80 px-6 py-2 border border-white/20 rounded-full inline-block shadow-lg">
                {question.targetDisplay}
              </div>
            </div>
          </div>

          {/* Action Pill Buttons: OVER / UNDER */}
          {!revealed ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleUserChoice('OVER')}
                className="py-4 px-6 rounded-full btn-portfolio-red font-black text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>OVER</span>
                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </button>

              <button
                onClick={() => handleUserChoice('UNDER')}
                className={`py-4 px-6 rounded-full font-black text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer group active:scale-95 border ${
                  isDark ? 'btn-portfolio-dark' : 'bg-white text-black border-slate-300'
                }`}
              >
                <span>UNDER</span>
                <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2 animate-pop">
              <div className="text-base sm:text-xl font-mono font-bold text-white bg-black/90 px-5 py-2 border border-white/20 rounded-full inline-block">
                ACTUAL VALUE: <span className="text-[#e63946] font-black">{question.displayA}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Status Stamp */}
      {revealed && (
        <div className="relative z-20 pb-4 animate-pop">
          {isCorrect ? (
            <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#00E664] text-black font-black text-lg sm:text-xl font-mono rounded-full border border-black shadow-lg">
              <Check className="w-6 h-6 stroke-[3]" />
              <span>STILL ALIVE (+1 STREAK)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#e63946] text-white font-black text-lg sm:text-xl font-mono rounded-full border border-black shadow-lg">
              <X className="w-6 h-6 stroke-[3]" />
              <span>YOU'RE OUT</span>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      {!revealed && (
        <div className="relative z-10 pb-2 text-[10px] sm:text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">
          TAP YOUR GUESS TO STAY ALIVE
        </div>
      )}
    </div>
  );
}
