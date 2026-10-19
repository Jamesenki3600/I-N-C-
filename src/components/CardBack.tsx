import React from 'react';

interface CardBackProps {
  className?: string;
  isSmall?: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({ className = '', isSmall = false }) => {
  if (isSmall) {
    return (
      <div
        className={`w-16 h-22 rounded-md border border-amber-600/60 bg-gradient-to-b from-blue-950 via-slate-950 to-blue-950 p-1 flex items-center justify-center relative overflow-hidden shadow-md select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 opacity-80" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-28 h-40 sm:w-32 sm:h-46 rounded-lg border-2 border-amber-600/80 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 p-2 flex flex-col items-center justify-center overflow-hidden shadow-xl select-none group ${className}`}
    >
      {/* Outer Golden Engraved Border */}
      <div className="absolute inset-1 rounded-md border border-amber-500/40 pointer-events-none" />
      <div className="absolute inset-1.5 rounded-sm border border-dashed border-amber-400/30 pointer-events-none" />

      {/* Runic Star Ring */}
      <div className="relative w-20 h-20 rounded-full border-2 border-amber-400/60 flex items-center justify-center shadow-lg shadow-amber-500/20">
        {/* Runic markings */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/40 rotate-45" />
        <div className="absolute inset-2 rounded-full border border-amber-300/30 rotate-12" />

        {/* Center Vortex Core */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-amber-500 to-indigo-900 flex items-center justify-center shadow-inner">
          <div className="w-4 h-4 rounded-full bg-white/90 shadow-md shadow-white/80 animate-pulse" />
        </div>
      </div>

      {/* Vanguard Arch Wordmark */}
      <div className="absolute bottom-3 text-center">
        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-300 drop-shadow-sm">
          CARDFIGHT!!
        </span>
        <span className="block font-mono text-[7px] font-bold uppercase tracking-wider text-cyan-300">
          VANGUARD
        </span>
      </div>
    </div>
  );
};
