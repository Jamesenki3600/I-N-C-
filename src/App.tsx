import React, { useState } from 'react';
import { CardData, DeckConfig } from './types/game';
import { PRESET_DECKS } from './data/decks';
import { BattleArena } from './components/BattleArena';
import { DeckBuilder } from './components/DeckBuilder';
import { CardCompendium } from './components/CardCompendium';
import { RevivalRulesGuide } from './components/RevivalRulesGuide';
import { CardDetailModal } from './components/CardDetailModal';
import { Swords } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'FIGHT' | 'DECK_BUILDER' | 'COMPENDIUM' | 'RULES'>('FIGHT');
  const [playerDeck, setPlayerDeck] = useState<DeckConfig>(PRESET_DECKS['royal-paladin-meta']);
  const [opponentDeck, setOpponentDeck] = useState<DeckConfig>(PRESET_DECKS['kagero-meta']);
  const [inspectedCard, setInspectedCard] = useState<CardData | null>(null);

  // Deck selector quick modal / change opponent
  const handleSelectOpponentDeck = (deckKey: string) => {
    if (PRESET_DECKS[deckKey]) {
      setOpponentDeck(PRESET_DECKS[deckKey]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Wordmark brand (1 line, shrink-0, no subtitles or pills)
        Zone 2: 4 single-line nav links with hover transitions
        Zone 3: 1 primary CTA
      */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('FIGHT')}
          className="text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Swords className="w-4 h-4 text-white" />
          </div>
          <span>Vanguard ZERO Revival</span>
        </button>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('FIGHT')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'FIGHT' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Cardfight Arena
          </button>
          <button
            onClick={() => setActiveTab('DECK_BUILDER')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'DECK_BUILDER' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Deck Customizer
          </button>
          <button
            onClick={() => setActiveTab('COMPENDIUM')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'COMPENDIUM' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Card Archive
          </button>
          <button
            onClick={() => setActiveTab('RULES')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'RULES' ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 pb-0.5' : 'hover:text-white'
            }`}
          >
            Zero Rules & Mechanics
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('FIGHT')}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Launch Cardfight
          </button>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'FIGHT' && (
          <BattleArena
            playerDeckConfig={playerDeck}
            opponentDeckConfig={opponentDeck}
            onSelectCardInspect={(card) => setInspectedCard(card)}
            onOpenDeckBuilder={() => setActiveTab('DECK_BUILDER')}
          />
        )}

        {activeTab === 'DECK_BUILDER' && (
          <DeckBuilder
            currentDeck={playerDeck}
            onSaveDeck={(savedDeck) => {
              setPlayerDeck(savedDeck);
              setActiveTab('FIGHT');
            }}
            onSelectCardInspect={(card) => setInspectedCard(card)}
          />
        )}

        {activeTab === 'COMPENDIUM' && (
          <CardCompendium
            onSelectCardInspect={(card) => setInspectedCard(card)}
          />
        )}

        {activeTab === 'RULES' && (
          <RevivalRulesGuide />
        )}
      </main>

      {/* Inspect Card Modal */}
      {inspectedCard && (
        <CardDetailModal
          card={inspectedCard}
          onClose={() => setInspectedCard(null)}
        />
      )}
    </div>
  );
}
