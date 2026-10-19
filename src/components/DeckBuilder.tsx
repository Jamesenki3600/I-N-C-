import React, { useState } from 'react';
import { DeckConfig, TriggerType, Clan, CardData } from '../types/game';
import { CARD_DATABASE, ALL_CARDS } from '../data/cards';
import { PRESET_DECKS } from '../data/decks';
import { CardView } from './CardView';
import { Check, Shield, Swords, Sparkles, Zap, Heart, RotateCcw, AlertTriangle, Layers, BookOpen } from 'lucide-react';

interface DeckBuilderProps {
  currentDeck: DeckConfig;
  onSaveDeck: (newDeck: DeckConfig) => void;
  onSelectCardInspect: (card: CardData) => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  currentDeck,
  onSaveDeck,
  onSelectCardInspect,
}) => {
  const [deck, setDeck] = useState<DeckConfig>({ ...currentDeck });
  const [selectedClan, setSelectedClan] = useState<Clan>(deck.clan);
  const [activeTab, setActiveTab] = useState<'GRADE_1' | 'GRADE_2' | 'GRADE_3' | 'TRIGGERS'>('GRADE_1');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Available cards for the selected clan
  const clanCards = ALL_CARDS.filter(c => c.clan === selectedClan);

  // Trigger counts on Grade 3 cards
  const triggerCounts = Object.values(deck.triggerAssignments).reduce(
    (acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    },
    { HEAL: 0, CRITICAL: 0, DRAW: 0, STAND: 0 } as Record<TriggerType, number>
  );

  // Load a preset deck
  const handleLoadPreset = (presetKey: string) => {
    const preset = PRESET_DECKS[presetKey];
    if (preset) {
      setDeck({ ...preset });
      setSelectedClan(preset.clan);
      setStatusMessage(`Loaded preset "${preset.name}"!`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Add / Remove card helper
  const handleAddCard = (card: CardData) => {
    if (card.grade === 0) {
      setDeck(prev => ({ ...prev, firstVanguardId: card.id }));
      return;
    }

    if (card.grade === 1) {
      if (deck.grade1CardIds.length >= 13) {
        setStatusMessage('Grade 1 pool full (maximum 13 cards in Vanguard Zero)');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
      // Check sentinel limit (max 4)
      if (card.isSentinel) {
        const sentinelCount = deck.grade1CardIds.filter(id => CARD_DATABASE[id]?.isSentinel).length;
        if (sentinelCount >= 4) {
          setStatusMessage('Maximum 4 Sentinels (Perfect Guards) allowed in Vanguard Zero!');
          setTimeout(() => setStatusMessage(null), 2500);
          return;
        }
      }
      setDeck(prev => ({ ...prev, grade1CardIds: [...prev.grade1CardIds, card.id] }));
    } else if (card.grade === 2) {
      if (deck.grade2CardIds.length >= 13) {
        setStatusMessage('Grade 2 pool full (maximum 13 cards in Vanguard Zero)');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
      setDeck(prev => ({ ...prev, grade2CardIds: [...prev.grade2CardIds, card.id] }));
    } else if (card.grade === 3) {
      if (deck.grade3CardIds.length >= 13) {
        setStatusMessage('Grade 3 pool full (maximum 13 cards in Vanguard Zero)');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
      const nextIndex = deck.grade3CardIds.length;
      setDeck(prev => ({
        ...prev,
        grade3CardIds: [...prev.grade3CardIds, card.id],
        triggerAssignments: {
          ...prev.triggerAssignments,
          [String(nextIndex)]: nextIndex < 4 ? 'HEAL' : 'CRITICAL'
        }
      }));
    }
  };

  const handleRemoveCard = (grade: 1 | 2 | 3, index: number) => {
    if (grade === 1) {
      setDeck(prev => ({
        ...prev,
        grade1CardIds: prev.grade1CardIds.filter((_, i) => i !== index)
      }));
    } else if (grade === 2) {
      setDeck(prev => ({
        ...prev,
        grade2CardIds: prev.grade2CardIds.filter((_, i) => i !== index)
      }));
    } else if (grade === 3) {
      const newAssignments: Record<string, TriggerType> = {};
      deck.grade3CardIds.filter((_, i) => i !== index).forEach((_, idx) => {
        newAssignments[String(idx)] = deck.triggerAssignments[String(idx)] || 'CRITICAL';
      });
      setDeck(prev => ({
        ...prev,
        grade3CardIds: prev.grade3CardIds.filter((_, i) => i !== index),
        triggerAssignments: newAssignments
      }));
    }
  };

  // Set trigger assignment on G3 slot
  const handleSetTrigger = (slotIndex: number, type: TriggerType) => {
    // If setting to HEAL, enforce max 4 heals
    if (type === 'HEAL') {
      const currentHeals = Object.values(deck.triggerAssignments).filter(t => t === 'HEAL').length;
      if (currentHeals >= 4 && deck.triggerAssignments[String(slotIndex)] !== 'HEAL') {
        setStatusMessage('Exactly 4 Heal triggers required in Vanguard Zero!');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
    }

    setDeck(prev => ({
      ...prev,
      triggerAssignments: {
        ...prev.triggerAssignments,
        [String(slotIndex)]: type
      }
    }));
  };

  // Validation
  const g1Count = deck.grade1CardIds.length;
  const g2Count = deck.grade2CardIds.length;
  const g3Count = deck.grade3CardIds.length;
  const totalDeckSize = 1 + g1Count + g2Count + g3Count;
  const healCount = triggerCounts.HEAL;
  const isValid = totalDeckSize === 40 && g1Count === 13 && g2Count === 13 && g3Count === 13 && healCount === 4;

  const handleSave = () => {
    if (!isValid) {
      setStatusMessage('Deck must have 1 FV, 13 G1s, 13 G2s, 13 G3s, and exactly 4 Heal Triggers!');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    onSaveDeck(deck);
    setStatusMessage('Deck saved and activated for battle!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" />
            <span>Vanguard ZERO 40-Card Standard Construction</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Deck Customizer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Construct authentic Zero format decks: 1 FV + 13 G1 + 13 G2 + 13 G3 with custom Grade 3 Trigger assignments.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Load Preset:</span>
          {Object.entries(PRESET_DECKS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleLoadPreset(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                deck.clan === preset.clan
                  ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {preset.clan}
            </button>
          ))}
        </div>
      </div>

      {/* Status notification toast */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Deck Composition Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 text-[11px]">First Vanguard</span>
          <span className="text-base font-bold text-white mt-1">
            {CARD_DATABASE[deck.firstVanguardId]?.name || 'None'}
          </span>
          <span className="text-[10px] text-cyan-400">1 / 1 (G0)</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          g1Count === 13 ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/90 border-slate-800 text-slate-200'
        }`}>
          <span className="text-slate-400 text-[11px]">Grade 1 Boosters</span>
          <span className="text-base font-bold mt-1">{g1Count} / 13</span>
          <span className="text-[10px] text-slate-400">Sentinels: {deck.grade1CardIds.filter(id => CARD_DATABASE[id]?.isSentinel).length}/4</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          g2Count === 13 ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/90 border-slate-800 text-slate-200'
        }`}>
          <span className="text-slate-400 text-[11px]">Grade 2 Intercepts</span>
          <span className="text-base font-bold mt-1">{g2Count} / 13</span>
          <span className="text-[10px] text-slate-400">Mandatory Shields</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          g3Count === 13 ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/90 border-slate-800 text-slate-200'
        }`}>
          <span className="text-slate-400 text-[11px]">Grade 3 Triggers</span>
          <span className="text-base font-bold mt-1">{g3Count} / 13</span>
          <span className="text-[10px] text-slate-400">Heals: {healCount}/4</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-slate-400 text-[11px]">Total Status</span>
          <span className={`text-base font-bold mt-1 ${isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
            {totalDeckSize} / 40
          </span>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`mt-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
              isValid
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isValid ? 'Activate Deck' : 'Incomplete'}
          </button>
        </div>
      </div>

      {/* Main Builder Grid: Current Deck vs Card Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Current Deck Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('GRADE_1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'GRADE_1' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grade 1s ({g1Count}/13)
            </button>
            <button
              onClick={() => setActiveTab('GRADE_2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'GRADE_2' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grade 2s ({g2Count}/13)
            </button>
            <button
              onClick={() => setActiveTab('GRADE_3')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'GRADE_3' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grade 3s ({g3Count}/13)
            </button>
            <button
              onClick={() => setActiveTab('TRIGGERS')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'TRIGGERS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trigger Settings
            </button>
          </div>

          {/* Cards currently in deck for active tab */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 min-h-[360px]">
            {activeTab === 'GRADE_1' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300">Grade 1 Boosters (Click to remove)</span>
                  <span className="text-xs font-mono text-slate-500">{g1Count} of 13 slots</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {deck.grade1CardIds.map((cardId, idx) => {
                    const card = CARD_DATABASE[cardId];
                    if (!card) return null;
                    return (
                      <div key={idx} className="relative group">
                        <CardView
                          card={card}
                          isSmall={true}
                          onClick={() => handleRemoveCard(1, idx)}
                        />
                        <button
                          onClick={() => handleRemoveCard(1, idx)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 13 - g1Count) }).map((_, i) => (
                    <div
                      key={`empty-g1-${i}`}
                      className="w-16 h-22 rounded-md border border-dashed border-slate-800 flex items-center justify-center text-slate-700 text-xs font-mono"
                    >
                      Empty
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'GRADE_2' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300">Grade 2 Interceptors (Click to remove)</span>
                  <span className="text-xs font-mono text-slate-500">{g2Count} of 13 slots</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {deck.grade2CardIds.map((cardId, idx) => {
                    const card = CARD_DATABASE[cardId];
                    if (!card) return null;
                    return (
                      <div key={idx} className="relative group">
                        <CardView
                          card={card}
                          isSmall={true}
                          onClick={() => handleRemoveCard(2, idx)}
                        />
                        <button
                          onClick={() => handleRemoveCard(2, idx)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 13 - g2Count) }).map((_, i) => (
                    <div
                      key={`empty-g2-${i}`}
                      className="w-16 h-22 rounded-md border border-dashed border-slate-800 flex items-center justify-center text-slate-700 text-xs font-mono"
                    >
                      Empty
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'GRADE_3' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300">Grade 3 Units (Click to remove)</span>
                  <span className="text-xs font-mono text-slate-500">{g3Count} of 13 slots</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {deck.grade3CardIds.map((cardId, idx) => {
                    const card = CARD_DATABASE[cardId];
                    if (!card) return null;
                    const assignedTrigger = deck.triggerAssignments[String(idx)] || 'CRITICAL';
                    return (
                      <div key={idx} className="relative group">
                        <CardView
                          card={{ ...card, triggerType: assignedTrigger }}
                          isSmall={true}
                          showTrigger={true}
                          onClick={() => handleRemoveCard(3, idx)}
                        />
                        <button
                          onClick={() => handleRemoveCard(3, idx)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 13 - g3Count) }).map((_, i) => (
                    <div
                      key={`empty-g3-${i}`}
                      className="w-16 h-22 rounded-md border border-dashed border-slate-800 flex items-center justify-center text-slate-700 text-xs font-mono"
                    >
                      Empty
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'TRIGGERS' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block mb-1">Vanguard ZERO Trigger Allocation Rule:</strong>
                  Triggers in Zero are assigned to your 13 Grade 3 cards. You must have{' '}
                  <span className="text-emerald-400 font-bold">exactly 4 Heal triggers</span>. The remaining 9 triggers can be distributed between{' '}
                  <span className="text-amber-400 font-bold">Critical</span>,{' '}
                  <span className="text-rose-400 font-bold">Draw</span>, or{' '}
                  <span className="text-cyan-400 font-bold">Stand</span>.
                </div>

                {/* Summary badges */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                    <span className="text-[10px] block text-emerald-400">HEAL</span>
                    <span className="text-lg font-bold">{triggerCounts.HEAL} / 4</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300">
                    <span className="text-[10px] block text-amber-400">CRITICAL</span>
                    <span className="text-lg font-bold">{triggerCounts.CRITICAL}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300">
                    <span className="text-[10px] block text-rose-400">DRAW</span>
                    <span className="text-lg font-bold">{triggerCounts.DRAW}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300">
                    <span className="text-[10px] block text-cyan-400">STAND</span>
                    <span className="text-lg font-bold">{triggerCounts.STAND}</span>
                  </div>
                </div>

                {/* Slots Assignment */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {deck.grade3CardIds.map((cardId, idx) => {
                    const card = CARD_DATABASE[cardId];
                    if (!card) return null;
                    const currentTrigger = deck.triggerAssignments[String(idx)] || 'CRITICAL';
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 w-5">#{idx + 1}</span>
                          <span className="font-bold text-white truncate max-w-[140px]">{card.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {(['CRITICAL', 'DRAW', 'STAND', 'HEAL'] as TriggerType[]).map((t) => (
                            <button
                              key={t}
                              onClick={() => handleSetTrigger(idx, t)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                currentTrigger === t
                                  ? t === 'HEAL'
                                    ? 'bg-emerald-500 text-slate-950 shadow'
                                    : t === 'CRITICAL'
                                    ? 'bg-amber-500 text-slate-950 shadow'
                                    : t === 'DRAW'
                                    ? 'bg-rose-600 text-white shadow'
                                    : 'bg-cyan-500 text-slate-950 shadow'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Card Library for adding (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              {selectedClan} Library
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Click card to add</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 max-h-[500px] overflow-y-auto space-y-2">
            {clanCards.map((card) => {
              const inDeckCount = [
                deck.firstVanguardId === card.id ? 1 : 0,
                deck.grade1CardIds.filter(id => id === card.id).length,
                deck.grade2CardIds.filter(id => id === card.id).length,
                deck.grade3CardIds.filter(id => id === card.id).length
              ].reduce((a, b) => a + b, 0);

              return (
                <div
                  key={card.id}
                  onClick={() => handleAddCard(card)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-950 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0">
                      G{card.grade}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {card.name}
                        </span>
                        {card.isSentinel && (
                          <span className="text-[8px] font-bold text-amber-300 bg-amber-950 px-1 rounded border border-amber-500/40">
                            PG
                          </span>
                        )}
                        {card.skills.includes('INTERCEPT') && (
                          <span className="text-[8px] font-bold text-cyan-300 bg-cyan-950 px-1 rounded border border-cyan-500/40">
                            INT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Power: {card.power.toLocaleString()} · Shield: {card.shield || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCardInspect(card);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-cyan-400 text-[10px]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {inDeckCount}/4
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
