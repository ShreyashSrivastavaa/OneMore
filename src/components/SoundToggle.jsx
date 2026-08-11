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
      aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}
      className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
    >
      {enabled ? (
        <>
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">SOUND ON</span>
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
