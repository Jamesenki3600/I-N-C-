import React from 'react';
import { CardData } from '../types/game';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface SentinelActivationModalProps {
  sentinelCard: CardData;
  defenderName: string;
  attackerName: string;
  onConfirm: () => void;
}

export const SentinelActivationModal: React.FC<SentinelActivationModalProps> = ({
  sentinelCard,
  defenderName,
  attackerName,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-2 border-cyan-400/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 w-64 h-64 rounded-full bg-cyan-500/25 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Vanguard Zero Auto-Sentinel Rule</span>
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
          PERFECT GUARD ACTIVATED!
        </h3>

        <p className="text-sm text-cyan-200/90 mb-4 max-w-xs">
          <strong className="text-white">{defenderName}</strong> activated{' '}
          <strong className="text-amber-300">{sentinelCard.name}</strong> from hand!
        </p>

        {/* Shield Graphic */}
        <div className="w-24 h-24 rounded-full border-4 border-cyan-400 bg-cyan-950/60 flex items-center justify-center shadow-lg shadow-cyan-400/30 my-2 animate-pulse">
          <ShieldCheck className="w-12 h-12 text-cyan-300" />
        </div>

        <div className="w-full my-4 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-300">
          <p className="font-semibold text-white mb-0.5">Absolute Defense</p>
          <p>The attack from <strong className="text-amber-400">{attackerName}</strong> cannot hit the Vanguard!</p>
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
        >
          Acknowledge Guard
        </button>
      </div>
    </div>
  );
};
