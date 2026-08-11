import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, toggleSound, playTapSound } from '../utils/audio';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
    if (newState) {
      playTapSound();
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      className="p-1.5 bg-[#16181a] border-2 border-black shadow-[3px_3px_0px_0px_#000] text-white hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 font-mono text-xs font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      {enabled ? (
        <>
          <Volume2 className="w-4 h-4 text-[#E2FF00]" />
          <span className="hidden sm:inline">AUDIO ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">MUTED</span>
        </>
      )}
    </button>
  );
}
