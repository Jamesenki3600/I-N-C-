import React, { useState } from 'react';
import { CardData } from '../types/game';
import { CardBack } from './CardBack';
import { X, Shield, Swords, Zap, Info, RotateCw, Sparkles, Maximize2 } from 'lucide-react';

interface CardDetailModalProps {
  card: CardData;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Grade {card.grade}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-300">{card.clan}</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono font-bold text-amber-400">{card.rarity}</span>
            {card.imageUrl && (
              <>
                <span className="text-slate-400">·</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  REPLICA TCG
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Interactive Card Presentation with Flip */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-52 h-72 rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 group">
                {!isFlipped ? (
                  card.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                      {/* Holographic foil sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none group-hover:opacity-100 opacity-40 transition-opacity" />

                      {/* Expand fullscreen button */}
                      <button
                        onClick={() => setIsFullscreenImage(true)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-white hover:bg-cyan-600 transition-colors border border-white/20 shadow-md cursor-pointer"
                        title="View Full High-Res Replica"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950">
                      <Swords className="w-10 h-10 text-amber-400 mb-2 opacity-60" />
                      <span className="text-sm font-bold text-white mb-1">{card.name}</span>
                      <span className="text-xs text-slate-400 font-mono">Power: {card.power.toLocaleString()}</span>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950">
                    <CardBack className="w-full h-full rounded-none border-none" />
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>{isFlipped ? 'Show Card Face' : 'Flip to Card Back'}</span>
              </button>
            </div>

            {/* Main Stats & Rulings */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h2 className="text-2xl font-black text-white">{card.name}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Cardfight!! Vanguard ZERO Authentic Database Record
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-amber-400" />
                    Power
                  </span>
                  <span className="text-amber-300 font-bold text-sm">{card.power.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Shield
                  </span>
                  <span className="text-slate-200 font-bold text-sm">{card.shield ? card.shield.toLocaleString() : '0'}</span>
                </div>
              </div>

              {/* Skills and Triggers */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-semibold">Classification:</span>
                {card.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 shadow-sm"
                  >
                    {skill.replace('_', ' ')}
                  </span>
                ))}
                {card.triggerType !== 'NONE' && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {card.triggerType} Trigger
                  </span>
                )}
                {card.isSentinel && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Sentinel (Perfect Guard)
                  </span>
                )}
              </div>

              {/* Card Ability */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Card Effect & Mechanics</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{card.ability}</p>
              </div>

              {/* Flavor Text */}
              {card.flavorText && (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 italic text-xs text-slate-400">
                  "{card.flavorText}"
                </div>
              )}
            </div>
          </div>

          {/* Zero Rule Note */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200/90 flex gap-2.5">
            <Info className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <strong className="text-cyan-300 font-semibold block mb-0.5">Vanguard ZERO Revival Rule:</strong>
              {card.grade === 2 && 'Grade 2 units on the front row serve as mandatory Interceptors. Opponents cannot attack your Vanguard while an active Grade 2 Interceptor stands in the front row.'}
              {card.grade === 3 && 'In Vanguard Zero, triggers are assigned to your Grade 3 units (4 Heals + 9 Triggers). Grade 3 Vanguards trigger Twin Drive on attack!'}
              {card.isSentinel && 'In Vanguard Zero, Perfect Guards activate automatically from hand when your Vanguard is faced with lethal or multi-critical damage.'}
              {card.grade <= 1 && !card.isSentinel && 'Grade 1 and Grade 0 units have the Boost skill, adding their power to the front-row unit directly ahead.'}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Replica Image Modal */}
      {isFullscreenImage && card.imageUrl && (
        <div
          onClick={() => setIsFullscreenImage(false)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-lg max-h-[90vh] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl">
            <img
              src={card.imageUrl}
              alt={card.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
