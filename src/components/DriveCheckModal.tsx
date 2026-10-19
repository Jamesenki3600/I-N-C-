import React from 'react';
import { CardData, TriggerType } from '../types/game';
import { CardView } from './CardView';
import { Sparkles, Zap, Heart, RotateCcw, Swords, CheckCircle2 } from 'lucide-react';

interface DriveCheckModalProps {
  card: CardData;
  isSecondDrive?: boolean;
  totalDrives: number;
  triggerType: TriggerType;
  attackerName: string;
  isOpponent: boolean;
  onConfirm: () => void;
}

export const DriveCheckModal: React.FC<DriveCheckModalProps> = ({
  card,
  isSecondDrive = false,
  totalDrives,
  triggerType,
  attackerName,
  isOpponent,
  onConfirm,
}) => {
  const isTrigger = triggerType !== 'NONE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        {/* Glow halo */}
        <div
          className={`absolute -top-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none ${
            triggerType === 'CRITICAL'
              ? 'bg-amber-500'
              : triggerType === 'HEAL'
              ? 'bg-emerald-500'
              : triggerType === 'DRAW'
              ? 'bg-rose-500'
              : triggerType === 'STAND'
              ? 'bg-cyan-500'
              : 'bg-indigo-500'
          }`}
        />

        {/* Header kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            {isOpponent ? "Opponent's" : "Your"} Drive Check
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-bold text-amber-400">
            {totalDrives > 1 ? (isSecondDrive ? 'Second Check (Twin Drive)' : 'First Check (Twin Drive)') : 'Single Drive'}
          </span>
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-400" />
          <span>{attackerName}</span>
        </h3>

        {/* Card Presentation with Dramatic Border */}
        <div className="my-2 transform transition-transform hover:scale-105 duration-300">
          <CardView card={card} showTrigger={true} />
        </div>

        {/* Trigger Outcome Banner */}
        {isTrigger ? (
          <div
            className={`w-full my-4 p-3 rounded-xl border flex flex-col items-center gap-1 ${
              triggerType === 'CRITICAL'
                ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                : triggerType === 'HEAL'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                : triggerType === 'DRAW'
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                : 'bg-cyan-950/50 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-black text-lg uppercase tracking-wide">
              {triggerType === 'CRITICAL' && <Zap className="w-5 h-5 fill-current text-amber-400" />}
              {triggerType === 'HEAL' && <Heart className="w-5 h-5 fill-current text-emerald-400" />}
              {triggerType === 'DRAW' && <Sparkles className="w-5 h-5 text-rose-400" />}
              {triggerType === 'STAND' && <RotateCcw className="w-5 h-5 text-cyan-400" />}
              <span>{triggerType} TRIGGER!</span>
            </div>

            <p className="text-xs font-medium text-slate-300">
              {triggerType === 'CRITICAL' && '+5,000 Power & Vanguard Critical +1!'}
              {triggerType === 'HEAL' && '+5,000 Power & Damage Zone Healed by 1!'}
              {triggerType === 'DRAW' && '+5,000 Power & Draw 1 Card!'}
              {triggerType === 'STAND' && '+5,000 Power & Stand 1 Rear-guard!'}
            </p>
          </div>
        ) : (
          <div className="w-full my-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium">
            No trigger checked. Card added to hand.
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onConfirm}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{totalDrives > 1 && !isSecondDrive ? 'Next Drive Check' : 'Proceed Battle'}</span>
        </button>
      </div>
    </div>
  );
};
