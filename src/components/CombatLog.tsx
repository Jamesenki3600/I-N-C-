import React from 'react';
import { GameLogEntry } from '../types/game';
import { Shield, Swords, Sparkles, AlertCircle, Heart, ChevronDown } from 'lucide-react';

interface CombatLogProps {
  logs: GameLogEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

export const CombatLog: React.FC<CombatLogProps> = ({ logs, isOpen, onToggle }) => {
  const getLogIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'ATTACK':
        return <Swords className="w-3.5 h-3.5 text-rose-400" />;
      case 'INTERCEPT':
      case 'SENTINEL':
        return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      case 'TRIGGER':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'HEAL':
        return <Heart className="w-3.5 h-3.5 text-emerald-400" />;
      case 'DAMAGE':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col transition-all">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-3 py-2 bg-slate-800/80 cursor-pointer select-none border-b border-slate-700/60 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200">Fight Combat Log</span>
          <span className="text-[10px] font-mono text-slate-400">({logs.length} events)</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Log items */}
      {isOpen && (
        <div className="max-h-56 overflow-y-auto p-2.5 space-y-1.5 font-sans text-xs">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic text-center py-2">No actions recorded yet.</p>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-start gap-2 p-1.5 rounded border ${
                  entry.player === 'PLAYER'
                    ? 'bg-blue-950/20 border-blue-900/40'
                    : 'bg-red-950/20 border-red-900/40'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">{getLogIcon(entry.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-mono">T{entry.turn}</span>
                    <span>·</span>
                    <span className={`font-semibold ${entry.player === 'PLAYER' ? 'text-blue-400' : 'text-red-400'}`}>
                      {entry.player === 'PLAYER' ? 'Player' : 'Opponent'}
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-xs mt-0.5 leading-snug">{entry.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
