import React, { useState } from 'react';
import { CardData, Clan, Grade } from '../types/game';
import { ALL_CARDS } from '../data/cards';
import { CardView } from './CardView';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';

interface CardCompendiumProps {
  onSelectCardInspect: (card: CardData) => void;
}

export const CardCompendium: React.FC<CardCompendiumProps> = ({ onSelectCardInspect }) => {
  const [selectedClan, setSelectedClan] = useState<Clan | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [onlyReplicaArt, setOnlyReplicaArt] = useState(false);

  const clans: Clan[] = ['Royal Paladin', 'Kagero', 'Shadow Paladin', 'Oracle Think Tank'];

  const filteredCards = ALL_CARDS.filter((card) => {
    if (onlyReplicaArt && !card.imageUrl) return false;
    if (selectedClan !== 'ALL' && card.clan !== selectedClan) return false;
    if (selectedGrade !== 'ALL' && card.grade !== selectedGrade) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.name.toLowerCase().includes(q) ||
        card.ability.toLowerCase().includes(q) ||
        card.clan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Cardfight!! Vanguard ZERO Card Compendium</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Card Database Archive</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Complete archive of resurrected Vanguard Zero cards. Explore iconic units, original Zero abilities, power lines, and clan synergies.
        </p>

        {/* Filter Toolbar */}
        <div className="mt-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by card name, clan, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Clan Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedClan('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedClan === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Clans
            </button>
            {clans.map((clan) => (
              <button
                key={clan}
                onClick={() => setSelectedClan(clan)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedClan === clan ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {clan}
              </button>
            ))}
          </div>

          {/* Grade Filters */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setSelectedGrade('ALL')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedGrade === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All G
            </button>
            {[0, 1, 2, 3].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g as Grade)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGrade === g ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                G{g}
              </button>
            ))}
          </div>

          {/* Replica Images Only Toggle */}
          <button
            onClick={() => setOnlyReplicaArt(!onlyReplicaArt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              onlyReplicaArt
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>Replica Cards Only</span>
          </button>
        </div>
      </div>

      {/* Results grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredCards.length}</strong> cards</span>
          <span className="font-mono text-[11px]">Click card for details</span>
        </div>

        {filteredCards.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <p className="text-slate-400 text-sm">No cards match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectCardInspect(card)}
                className="transform transition-transform hover:-translate-y-1"
              >
                <CardView
                  card={card}
                  showTrigger={true}
                  onInspect={onSelectCardInspect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
