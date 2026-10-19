import React from 'react';
import { CardData, TriggerType } from '../types/game';
import { CardView } from './CardView';
import { Heart, Zap, Sparkles, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface DamageCheckModalProps {
  card: CardData;
  triggerType: TriggerType;
  currentDamage: number;
  maxDamage: number;
  isOpponent: boolean;
  healed: boolean;
  onConfirm: () => void;
}

export const DamageCheckModal: React.FC<DamageCheckModalProps> = ({
  card,
  triggerType,
  currentDamage,
  maxDamage,
  isOpponent,
  healed,
  onConfirm,
}) => {
  const isTrigger = triggerType !== 'NONE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-24 w-64 h-64 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        {/* Header kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {isOpponent ? "Opponent" : "Player"} Damage Check
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-bold text-slate-300 font-mono">
            Damage: {currentDamage} / {maxDamage}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">
          Hit Connected! Checking Damage Trigger...
        </h3>

        {/* Card Checked */}
        <div className="my-2 transform transition-transform hover:scale-105 duration-300">
          <CardView card={card} showTrigger={true} />
        </div>

        {/* Trigger Banner */}
        {isTrigger ? (
          <div
            className={`w-full my-4 p-3 rounded-xl border flex flex-col items-center gap-1 ${
              triggerType === 'HEAL'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-black text-lg uppercase tracking-wide">
              {triggerType === 'HEAL' && <Heart className="w-5 h-5 fill-current text-emerald-400" />}
              {triggerType === 'CRITICAL' && <Zap className="w-5 h-5 fill-current text-amber-400" />}
              {triggerType === 'DRAW' && <Sparkles className="w-5 h-5 text-rose-400" />}
              {triggerType === 'STAND' && <RotateCcw className="w-5 h-5 text-cyan-400" />}
              <span>DAMAGE TRIGGER: {triggerType}!</span>
            </div>

            <p className="text-xs font-medium text-slate-200">
              {triggerType === 'HEAL'
                ? (healed ? 'Damage Healed by 1! Saved from the brink!' : 'Damage was less than opponent — Heal effect skipped, +5,000 Power applied.')
                : '+5,000 Power to the Vanguard during this turn!'}
            </p>
          </div>
        ) : (
          <div className="w-full my-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium">
            No trigger. Card placed in Damage Zone.
          </div>
        )}

        <button
          onClick={onConfirm}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
