import React from 'react';
import { CardData, TriggerType } from '../types/game';
import { Shield, Sparkles, Swords, Zap, Heart, RotateCcw, Eye } from 'lucide-react';

interface CardViewProps {
  card: CardData;
  isSelected?: boolean;
  isPlayable?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  onInspect?: (card: CardData) => void;
  showTrigger?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected,
  isPlayable,
  isSmall = false,
  onClick,
  onInspect,
  showTrigger = false,
}) => {
  // Clan theme colors
  const clanColors: Record<string, { bg: string; border: string; accent: string; text: string }> = {
    'Royal Paladin': { bg: 'from-blue-950 via-slate-900 to-indigo-950', border: 'border-blue-500/50', accent: 'bg-blue-600', text: 'text-blue-300' },
    'Kagero': { bg: 'from-amber-950 via-red-950 to-slate-950', border: 'border-amber-500/50', accent: 'bg-red-600', text: 'text-amber-300' },
    'Shadow Paladin': { bg: 'from-purple-950 via-slate-950 to-neutral-950', border: 'border-purple-500/50', accent: 'bg-purple-700', text: 'text-purple-300' },
    'Oracle Think Tank': { bg: 'from-amber-950 via-rose-950 to-slate-950', border: 'border-rose-400/50', accent: 'bg-rose-600', text: 'text-rose-300' },
    'Nova Grappler': { bg: 'from-cyan-950 via-slate-900 to-teal-950', border: 'border-cyan-500/50', accent: 'bg-cyan-600', text: 'text-cyan-300' }
  };

  const theme = clanColors[card.clan] || clanColors['Royal Paladin'];

  // Trigger indicator badge
  const renderTriggerIcon = (trigger: TriggerType) => {
    switch (trigger) {
      case 'CRITICAL':
        return (
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>Crit</span>
          </div>
        );
      case 'DRAW':
        return (
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Draw</span>
          </div>
        );
      case 'HEAL':
        return (
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
            <Heart className="w-2.5 h-2.5 fill-current" />
            <span>Heal</span>
          </div>
        );
      case 'STAND':
        return (
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-sm">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Stand</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (isSmall) {
    return (
      <div
        onClick={onClick}
        className={`relative w-16 h-22 rounded-md border text-[10px] select-none cursor-pointer overflow-hidden transition-all duration-150 flex flex-col justify-between p-1 shadow-md ${
          isSelected
            ? 'ring-2 ring-cyan-400 scale-105 z-20 border-cyan-300'
            : isPlayable
            ? 'ring-1 ring-amber-400 hover:scale-105 hover:ring-2'
            : 'hover:scale-102'
        } ${theme.border} bg-slate-950`}
      >
        {/* Full Image Replica Background if Available */}
        {card.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={card.imageUrl}
              alt={card.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
          </div>
        ) : null}

        <div className="relative z-10 flex justify-between items-center leading-none">
          <span className="font-extrabold text-[11px] text-amber-300 font-mono drop-shadow">G{card.grade}</span>
          {card.skills.includes('INTERCEPT') && (
            <span className="text-[8px] font-bold text-cyan-300 bg-cyan-950/90 px-0.5 rounded border border-cyan-400/50">
              INT
            </span>
          )}
          {card.isSentinel && (
            <span className="text-[8px] font-bold text-amber-300 bg-amber-950/90 px-0.5 rounded border border-amber-400/50">
              PG
            </span>
          )}
        </div>

        {/* Center label if no image */}
        {!card.imageUrl && (
          <div className="relative z-10 my-auto w-full text-center px-0.5">
            <span className="text-[8px] font-semibold text-slate-200 block truncate">{card.name}</span>
          </div>
        )}

        <div className="relative z-10 flex justify-between items-center pt-0.5 leading-none">
          <span className="font-mono font-bold text-[9px] text-amber-300 drop-shadow">{(card.power / 1000).toFixed(0)}k</span>
          {card.triggerType !== 'NONE' && (
            <span className="text-[8px] font-bold text-amber-400 drop-shadow">{card.triggerType[0]}</span>
          )}
        </div>
      </div>
    );
  }

  // Full Replica Card Frame
  const hasFullReplicaImage = Boolean(card.imageUrl);

  return (
    <div
      onClick={onClick}
      className={`relative w-28 h-40 sm:w-32 sm:h-46 rounded-lg border text-xs select-none cursor-pointer overflow-hidden transition-all duration-200 flex flex-col justify-between p-1 shadow-xl group ${
        isSelected
          ? 'ring-2 ring-cyan-400 -translate-y-2 z-30 border-cyan-300 shadow-cyan-500/30'
          : isPlayable
          ? 'ring-1 ring-amber-400 hover:-translate-y-1 hover:ring-2 border-amber-400/70'
          : 'hover:-translate-y-1 hover:border-slate-400/50'
      } ${theme.border} bg-slate-950`}
    >
      {/* 
        IF REPLICA IMAGE IS AVAILABLE:
        The full replica card art fills the container with authentic card borders,
        and subtle contextual badges overlay on top.
      */}
      {hasFullReplicaImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <img
              src={card.imageUrl}
              alt={card.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Holographic foil sheen */}
            {card.rarity === 'RRR' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
          </div>

          {/* Top Overlay Bar */}
          <div className="relative z-10 flex items-center justify-between gap-1 p-1 leading-none">
            {/* Grade Shield */}
            <div className="w-5 h-5 rounded bg-gradient-to-b from-amber-300 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-md border border-amber-200">
              {card.grade}
            </div>

            <div className="flex items-center gap-1">
              {showTrigger && card.triggerType !== 'NONE' && renderTriggerIcon(card.triggerType)}
              {card.isSentinel && (
                <span className="text-[8px] font-bold text-amber-300 bg-amber-950/90 px-1 py-0.5 rounded border border-amber-500/60 shadow">
                  SENTINEL
                </span>
              )}
              {onInspect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(card);
                  }}
                  className="p-1 rounded bg-slate-900/90 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/20 shadow-md ml-0.5"
                  title="View Card Art Side & Rulings"
                >
                  <Eye className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Card Identity & Power Strip */}
          <div className="relative z-10 p-1 rounded bg-slate-950/85 backdrop-blur-xs border border-white/10 space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white truncate max-w-[85px] drop-shadow-sm">
                {card.name}
              </span>
              {card.skills.includes('INTERCEPT') && (
                <span className="text-[7.5px] font-bold text-cyan-300 bg-cyan-950 px-1 rounded border border-cyan-400/50">
                  INTERCEPT
                </span>
              )}
              {card.skills.includes('TWIN_DRIVE') && (
                <span className="text-[7.5px] font-bold text-amber-300 bg-amber-950 px-1 rounded border border-amber-400/50">
                  TWIN DRIVE
                </span>
              )}
            </div>

            <div className="flex items-center justify-between font-mono pt-0.5 border-t border-white/10">
              <div className="flex items-center gap-0.5 font-bold text-amber-300 text-[11px]">
                <Swords className="w-2.5 h-2.5 text-amber-400" />
                <span>{card.power.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[9px] text-slate-400">
                <Shield className="w-2.5 h-2.5" />
                <span>{card.shield ? card.shield.toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 
          FALLBACK REPLICA TCG FRAME:
          Detailed Cardfight Vanguard Card Architecture
        */
        <>
          {/* Ornate Gold Frame Trim */}
          <div className="absolute inset-0.5 rounded border border-amber-500/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 pointer-events-none" />

          {/* Top Bar: Grade & Clan */}
          <div className="relative z-10 flex items-center justify-between gap-1 pb-1 border-b border-amber-500/30">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-sm bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-sm">
                {card.grade}
              </div>
              <span className="text-[9px] font-semibold text-slate-300 truncate max-w-[65px]">
                {card.clan.replace(' Paladin', ' P.')}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {showTrigger && card.triggerType !== 'NONE' && renderTriggerIcon(card.triggerType)}
              {card.isSentinel && (
                <span className="text-[8px] font-bold text-amber-300 bg-amber-950/80 px-1 py-0.5 rounded border border-amber-500/50">
                  SENTINEL
                </span>
              )}
              {onInspect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(card);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/20 shadow-md ml-0.5"
                  title="View Card Art Side & Rulings"
                >
                  <Eye className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* Center Art Window */}
          <div className="relative z-10 my-1 w-full flex-1 rounded bg-slate-900/90 overflow-hidden border border-white/10 flex flex-col items-center justify-center p-1">
            {card.grade === 3 && <Swords className="w-6 h-6 text-amber-400 mb-1 opacity-70" />}
            {card.grade === 2 && <Shield className="w-6 h-6 text-cyan-400 mb-1 opacity-70" />}
            {card.grade <= 1 && <Zap className="w-6 h-6 text-indigo-400 mb-1 opacity-70" />}
            <span className="text-[9.5px] font-bold text-slate-100 text-center line-clamp-2 leading-tight">
              {card.name}
            </span>
          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 flex items-center justify-between pt-1 border-t border-amber-500/30 font-mono">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Swords className="w-3 h-3 text-amber-400" />
              <span>{card.power.toLocaleString()}</span>
            </div>
            <div className="text-[9px] text-slate-400">
              {card.shield ? card.shield.toLocaleString() : '—'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
