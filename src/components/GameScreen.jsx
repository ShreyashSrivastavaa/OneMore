import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
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
    <div className={`relative w-full min-h-[100dvh] flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden transition-colors ${
      isDark ? 'bg-grid-dark text-[#F5F3E9]' : 'bg-grid-light text-[#0c0d0e]'
    } ${revealed && isCorrect ? 'ring-6 sm:ring-8 ring-[#00E664] transition-all' : ''} ${
      revealed && !isCorrect ? 'animate-shake-hard ring-6 sm:ring-8 ring-[#FF3333]' : ''
    }`}>

      {/* Header Spacer */}
      <div className="h-14 sm:h-16" />

      {/* Question Prompt Badge */}
      <div className="relative z-10 w-full max-w-xl text-center space-y-2 sm:space-y-3 my-auto animate-pop px-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-black text-[#E2FF00] font-mono text-[11px] sm:text-xs font-bold border-2 border-black shadow-[3px_3px_0px_0px_#E2FF00] uppercase tracking-wider">
          <span>{categoryTheme.icon}</span>
          <span>{question.category} • {question.formatType.replace('_', ' ')}</span>
        </div>

        <h2 className={`text-xl sm:text-4xl font-black tracking-tight leading-tight font-sans ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          {question.prompt}
        </h2>
      </div>

      {/* RENDER LAYOUT BASED ON ROUND FORMAT */}

      {/* FORMAT 1 & 3: PICK WINNER OR TIMELINE (2-CARD BATTLE) */}
      {(question.formatType === ROUND_FORMATS.PICK_WINNER || question.formatType === ROUND_FORMATS.TIMELINE) && (
        <div className="relative z-10 my-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 px-1 sm:px-2">
          
          {/* CARD A */}
          <div
            onClick={() => handleUserChoice('A')}
            className={`group relative rounded-none border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] p-5 sm:p-8 min-h-[190px] sm:min-h-[280px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDark ? 'bg-[#16181a]' : 'bg-white'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'A' ? (isCorrect ? 'ring-4 ring-[#00E664]' : 'ring-4 ring-[#FF3333]') : ''
            }`}
          >
            <div className="space-y-3 sm:space-y-4 w-full">
              <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-none">
                “{question.entityA}”
              </div>

              {!revealed ? (
                <div className="inline-block py-2.5 sm:py-3 px-5 sm:px-6 brutal-btn-yellow font-black text-lg sm:text-xl font-mono tracking-wider uppercase mt-1">
                  TAP TO CHOOSE
                </div>
              ) : (
                <div className="space-y-1 animate-pop">
                  <div className="text-2xl sm:text-5xl font-black text-[#E2FF00] font-mono bg-black px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-black inline-block shadow-[3px_3px_0px_0px_#000]">
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
            className={`group relative rounded-none border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] p-5 sm:p-8 min-h-[190px] sm:min-h-[280px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDark ? 'bg-[#16181a]' : 'bg-white'
            } ${!revealed ? 'active:scale-98' : ''} ${
              revealed && userChoice === 'B' ? (isCorrect ? 'ring-4 ring-[#00E664]' : 'ring-4 ring-[#FF3333]') : ''
            }`}
          >
            <div className="space-y-3 sm:space-y-4 w-full">
              <div className="text-3xl sm:text-5xl font-black font-sans tracking-tight leading-none">
                “{question.entityB}”
              </div>

              {!revealed ? (
                <div className="inline-block py-2.5 sm:py-3 px-5 sm:px-6 brutal-btn-yellow font-black text-lg sm:text-xl font-mono tracking-wider uppercase mt-1">
                  TAP TO CHOOSE
                </div>
              ) : (
                <div className="space-y-1 animate-pop">
                  <div className="text-2xl sm:text-5xl font-black text-[#E2FF00] font-mono bg-black px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-black inline-block shadow-[3px_3px_0px_0px_#000]">
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
        <div className="relative z-10 my-auto w-full max-w-lg space-y-4 sm:space-y-6 px-2">
          
          {/* Main Threshold Entity Card */}
          <div className={`relative rounded-none border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 flex flex-col items-center justify-center text-center ${
            isDark ? 'bg-[#16181a]' : 'bg-white'
          }`}>
            <div className="space-y-2 sm:space-y-3 w-full">
              <div className="text-3xl sm:text-6xl font-black font-sans tracking-tight leading-none">
                “{question.entityA}”
              </div>

              <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                TARGET THRESHOLD
              </div>

              <div className="text-3xl sm:text-6xl font-black text-[#E2FF00] font-mono bg-black px-4 sm:px-6 py-2 border-3 border-black inline-block shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
                {question.targetDisplay}
              </div>
            </div>
          </div>

          {/* Action Buttons: OVER / UNDER */}
          {!revealed ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleUserChoice('OVER')}
                className="py-3.5 sm:py-4 px-4 sm:px-6 brutal-btn-yellow font-black text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>OVER</span>
                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </button>

              <button
                onClick={() => handleUserChoice('UNDER')}
                className="py-3.5 sm:py-4 px-4 sm:px-6 brutal-btn-white font-black text-xl sm:text-2xl tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>UNDER</span>
                <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2 animate-pop">
              <div className="text-base sm:text-xl font-mono font-bold text-white bg-black px-4 py-2 border-2 border-black inline-block shadow-[3px_3px_0px_0px_#000]">
                ACTUAL VALUE: <span className="text-[#E2FF00] font-black">{question.displayA}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Result Status Stamp */}
      {revealed && (
        <div className="relative z-20 pb-3 sm:pb-4 animate-pop">
          {isCorrect ? (
            <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#00E664] text-black font-black text-lg sm:text-xl font-mono border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] transform -rotate-1">
              <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
              <span>CORRECT! +1 STREAK</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#FF3333] text-white font-black text-lg sm:text-xl font-mono border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] transform rotate-1">
              <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
              <span>WRONG!</span>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      {!revealed && (
        <div className="relative z-10 pb-2 text-[10px] sm:text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">
          TAP YOUR GUESS TO REVEAL
        </div>
      )}
    </div>
  );
}
