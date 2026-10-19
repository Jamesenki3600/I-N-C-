import React from 'react';
import { FieldUnit, CirclePosition, CardData } from '../types/game';
import { Shield, Swords, Zap, ArrowUp, AlertCircle } from 'lucide-react';

interface FieldCircleProps {
  position: CirclePosition;
  unit?: FieldUnit;
  isVanguard?: boolean;
  isOpponent?: boolean;
  isSelected?: boolean;
  isTargetable?: boolean;
  isBlockedByIntercept?: boolean;
  isCallTarget?: boolean;
  isBoosterSelected?: boolean;
  onClick?: () => void;
  onCardInspect?: (card: CardData) => void;
}

export const FieldCircle: React.FC<FieldCircleProps> = ({
  position,
  unit,
  isVanguard = false,
  isOpponent = false,
  isSelected = false,
  isTargetable = false,
  isBlockedByIntercept = false,
  isCallTarget = false,
  isBoosterSelected = false,
  onClick,
  onCardInspect,
}) => {
  const isFrontRow = position === 'FRONT_LEFT' || position === 'VANGUARD' || position === 'FRONT_RIGHT';
  const hasIntercept = unit && unit.card.skills.includes('INTERCEPT') && isFrontRow;
  const totalPower = unit ? unit.card.power + (unit.tempPowerBonus || 0) : 0;

  // Circle label
  const getCircleLabel = () => {
    if (isVanguard) return 'VANGUARD';
    switch (position) {
      case 'FRONT_LEFT': return 'FRONT L';
      case 'FRONT_RIGHT': return 'FRONT R';
      case 'BACK_LEFT': return 'REAR L';
      case 'BACK_CENTER': return 'REAR C';
      case 'BACK_RIGHT': return 'REAR R';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Circle Container */}
      <div
        onClick={onClick}
        className={`relative w-24 h-32 sm:w-28 sm:h-38 rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between p-1.5 overflow-hidden select-none ${
          isVanguard
            ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 shadow-lg shadow-amber-500/10'
            : isFrontRow
            ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/30 via-slate-900/90 to-slate-950'
            : 'border-slate-700/60 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-950'
        } ${
          isSelected
            ? 'ring-4 ring-cyan-400 border-cyan-300 scale-105 z-30 shadow-xl shadow-cyan-500/40 animate-pulse'
            : isTargetable
            ? 'ring-4 ring-rose-500 border-rose-400 scale-105 z-30 shadow-xl shadow-rose-500/40 animate-pulse'
            : isCallTarget
            ? 'ring-2 ring-emerald-400 border-emerald-400/80 bg-emerald-950/30 hover:scale-102'
            : isBoosterSelected
            ? 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-950/40'
            : isBlockedByIntercept
            ? 'opacity-60 cursor-not-allowed border-dashed border-red-500/40'
            : 'hover:border-slate-400'
        }`}
      >
        {/* Holographic background circle lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-20 h-20 rounded-full border border-current" />
          <div className="w-14 h-14 rounded-full border border-dashed border-current absolute" />
        </div>

        {/* Top Header: Label & Status */}
        <div className="w-full relative z-10 flex items-center justify-between text-[10px] font-semibold leading-none">
          <span
            className={`font-mono tracking-wider ${
              isVanguard ? 'text-amber-300 font-bold' : 'text-slate-400'
            }`}
          >
            {getCircleLabel()}
          </span>

          {unit && unit.isRested && (
            <span className="text-[9px] font-bold text-amber-400 bg-amber-950/90 px-1 py-0.5 rounded border border-amber-500/40">
              REST
            </span>
          )}

          {hasIntercept && (
            <span className="flex items-center gap-0.5 text-[8px] font-bold text-cyan-300 bg-cyan-950/90 px-1 py-0.5 rounded border border-cyan-400/50">
              <Shield className="w-2.5 h-2.5 fill-current" />
              INT
            </span>
          )}
        </div>

        {/* Center Unit Art or Empty Circle */}
        {unit ? (
          <div
            className={`relative z-10 w-full flex-1 my-1 rounded-lg overflow-hidden border border-white/20 bg-slate-950 flex flex-col items-center justify-center transition-all ${
              unit.isRested ? 'rotate-6 scale-95 opacity-80' : ''
            }`}
          >
            {unit.card.imageUrl ? (
              <img
                src={unit.card.imageUrl}
                alt={unit.card.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-1 text-center">
                <span className="text-[10px] font-bold text-slate-100 line-clamp-2 leading-tight">
                  {unit.card.name}
                </span>
              </div>
            )}

            {/* Inspect button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCardInspect?.(unit.card);
              }}
              title="Inspect card details"
              className="absolute top-1 right-1 p-0.5 rounded bg-black/60 hover:bg-cyan-600 text-white text-[9px] transition-colors"
            >
              Info
            </button>

            {/* Grade Badge */}
            <div className="absolute top-1 left-1 w-4 h-4 rounded bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono shadow">
              {unit.card.grade}
            </div>

            {/* Critical multiplier if > 1 */}
            {(unit.tempCritBonus > 0 || (isVanguard && unit.tempCritBonus > 0)) && (
              <div className="absolute bottom-1 right-1 px-1 rounded bg-amber-500 text-slate-950 font-extrabold text-[9px] flex items-center gap-0.5 shadow">
                <Zap className="w-2.5 h-2.5 fill-current" />
                <span>{1 + unit.tempCritBonus}★</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 w-full flex-1 my-1 flex flex-col items-center justify-center text-slate-500">
            {isCallTarget ? (
              <div className="flex flex-col items-center gap-1 text-emerald-400">
                <ArrowUp className="w-5 h-5 animate-bounce" />
                <span className="text-[10px] font-bold">CALL HERE</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border border-dashed border-slate-700 flex items-center justify-center opacity-60">
                <span className="text-xs">+</span>
              </div>
            )}
          </div>
        )}

        {/* Footer: Power display */}
        <div className="w-full relative z-10 flex items-center justify-between border-t border-white/10 pt-1 leading-none">
          {unit ? (
            <div className="flex items-center justify-between w-full font-mono">
              <div className="flex items-center gap-0.5 text-xs font-bold text-amber-300">
                <Swords className="w-3 h-3 text-amber-400" />
                <span className={unit.tempPowerBonus > 0 ? 'text-emerald-400 font-extrabold' : ''}>
                  {totalPower.toLocaleString()}
                </span>
              </div>
              {unit.tempPowerBonus > 0 && (
                <span className="text-[9px] font-bold text-emerald-400">
                  +{unit.tempPowerBonus / 1000}k
                </span>
              )}
            </div>
          ) : (
            <span className="text-[9px] text-slate-600 font-mono text-center w-full">EMPTY</span>
          )}
        </div>
      </div>

      {/* Intercept blocked warning tooltip */}
      {isBlockedByIntercept && (
        <div className="absolute -bottom-6 z-40 bg-rose-950/95 border border-rose-500 text-rose-200 text-[9px] px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
          <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
          <span>Must attack Intercept first!</span>
        </div>
      )}
    </div>
  );
};
