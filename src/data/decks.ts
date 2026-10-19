import { DeckConfig, CardData } from '../types/game';
import { CARD_DATABASE } from './cards';

export const PRESET_DECKS: Record<string, DeckConfig> = {
  'royal-paladin-meta': {
    id: 'royal-paladin-meta',
    name: 'Sanctuary Light: Blaster Blade & Alfred',
    clan: 'Royal Paladin',
    firstVanguardId: 'rp-g0-01', // Barcgal
    grade1CardIds: [
      'rp-g1-02', 'rp-g1-02', 'rp-g1-02', 'rp-g1-02', // 4x Flash Shield Iseult (Sentinels)
      'rp-g1-01', 'rp-g1-01', 'rp-g1-01', 'rp-g1-01', // 4x Little Sage Marron (8k)
      'rp-g1-03', 'rp-g1-03', 'rp-g1-03',             // 3x Wingal
      'rp-g1-04', 'rp-g1-04'                          // 2x Pongal
    ],
    grade2CardIds: [
      'rp-g2-01', 'rp-g2-01', 'rp-g2-01', 'rp-g2-01', // 4x Blaster Blade
      'rp-g2-02', 'rp-g2-02', 'rp-g2-02', 'rp-g2-02', // 4x Knight of Silence Gallatin (10k)
      'rp-g2-03', 'rp-g2-03', 'rp-g2-03',             // 3x Akane
      'rp-g2-04', 'rp-g2-04'                          // 2x Tristram
    ],
    grade3CardIds: [
      'rp-g3-01', 'rp-g3-01', 'rp-g3-01', 'rp-g3-01', // 4x King of Knights Alfred
      'rp-g3-02', 'rp-g3-02',                         // 2x Soul Saver Dragon
      'rp-g3-03', 'rp-g3-03', 'rp-g3-03', 'rp-g3-03', // 4x Gancelot (Heal)
      'rp-g3-04', 'rp-g3-04', 'rp-g3-04'              // 3x Brigitte
    ],
    triggerAssignments: {
      '0': 'CRITICAL', '1': 'CRITICAL', '2': 'CRITICAL', '3': 'CRITICAL', '4': 'CRITICAL',
      '5': 'DRAW', '6': 'DRAW', '7': 'DRAW', '8': 'DRAW',
      '9': 'HEAL', '10': 'HEAL', '11': 'HEAL', '12': 'HEAL'
    }
  },

  'kagero-meta': {
    id: 'kagero-meta',
    name: 'Molten Apocalypse: Dragonic Overlord',
    clan: 'Kagero',
    firstVanguardId: 'kg-g0-01', // Conroe
    grade1CardIds: [
      'kg-g1-02', 'kg-g1-02', 'kg-g1-02', 'kg-g1-02', // 4x Wyvern Guard Barri (Sentinel)
      'kg-g1-01', 'kg-g1-01', 'kg-g1-01', 'kg-g1-01', // 4x Embodiment of Armor Bahr
      'kg-g1-03', 'kg-g1-03', 'kg-g1-03', 'kg-g1-03', // 4x Dragon Monk Gojo
      'kg-g1-01'                                      // 1x Bahr
    ],
    grade2CardIds: [
      'kg-g2-01', 'kg-g2-01', 'kg-g2-01', 'kg-g2-01', // 4x Berserk Dragon (CB2 Retire!)
      'kg-g2-02', 'kg-g2-02', 'kg-g2-02', 'kg-g2-02', // 4x Dragon Knight Nehalem (10k)
      'kg-g2-03', 'kg-g2-03', 'kg-g2-03', 'kg-g2-03', // 4x Bellicosity Dragon
      'kg-g2-02'                                      // 1x Nehalem
    ],
    grade3CardIds: [
      'kg-g3-01', 'kg-g3-01', 'kg-g3-01', 'kg-g3-01', // 4x Dragonic Overlord
      'kg-g3-02', 'kg-g3-02',                         // 2x Vortex Dragon
      'kg-g3-03', 'kg-g3-03', 'kg-g3-03',             // 3x Executioner
      'kg-g3-04', 'kg-g3-04', 'kg-g3-04', 'kg-g3-04'  // 4x Genjo (Heal)
    ],
    triggerAssignments: {
      '0': 'CRITICAL', '1': 'CRITICAL', '2': 'CRITICAL', '3': 'CRITICAL',
      '4': 'DRAW', '5': 'DRAW', '6': 'DRAW', '7': 'DRAW', '8': 'DRAW',
      '9': 'HEAL', '10': 'HEAL', '11': 'HEAL', '12': 'HEAL'
    }
  },

  'shadow-paladin-meta': {
    id: 'shadow-paladin-meta',
    name: 'Abyss Conquest: Phantom Blaster Dragon',
    clan: 'Shadow Paladin',
    firstVanguardId: 'sp-g0-01', // Fullbau
    grade1CardIds: [
      'sp-g1-02', 'sp-g1-02', 'sp-g1-02', 'sp-g1-02', // 4x Mac Lir (Sentinel)
      'sp-g1-01', 'sp-g1-01', 'sp-g1-01', 'sp-g1-01', // 4x Blaster Javelin
      'sp-g1-03', 'sp-g1-03', 'sp-g1-03', 'sp-g1-03', // 4x Charon
      'sp-g1-01'                                      // 1x Javelin
    ],
    grade2CardIds: [
      'sp-g2-01', 'sp-g2-01', 'sp-g2-01', 'sp-g2-01', // 4x Blaster Dark
      'sp-g2-02', 'sp-g2-02', 'sp-g2-02', 'sp-g2-02', // 4x Macha
      'sp-g2-03', 'sp-g2-03', 'sp-g2-03', 'sp-g2-03', // 4x Nemain
      'sp-g2-01'                                      // 1x Blaster Dark
    ],
    grade3CardIds: [
      'sp-g3-01', 'sp-g3-01', 'sp-g3-01', 'sp-g3-01', // 4x Phantom Blaster Dragon
      'sp-g3-02', 'sp-g3-02', 'sp-g3-02', 'sp-g3-02', // 4x Dark Dictator
      'sp-g3-03', 'sp-g3-03', 'sp-g3-03', 'sp-g3-03', // 4x Grim Reaper (Heal)
      'sp-g3-01'                                      // 1x PBD
    ],
    triggerAssignments: {
      '0': 'CRITICAL', '1': 'CRITICAL', '2': 'CRITICAL', '3': 'CRITICAL', '4': 'CRITICAL',
      '5': 'DRAW', '6': 'DRAW', '7': 'DRAW', '8': 'DRAW',
      '9': 'HEAL', '10': 'HEAL', '11': 'HEAL', '12': 'HEAL'
    }
  },

  'oracle-think-tank-meta': {
    id: 'oracle-think-tank-meta',
    name: 'Imperial Oracle: Amaterasu & Silent Tom',
    clan: 'Oracle Think Tank',
    firstVanguardId: 'ot-g0-01', // Ichibyoshi
    grade1CardIds: [
      'ot-g1-01', 'ot-g1-01', 'ot-g1-01', 'ot-g1-01', // 4x Chocolat (Sentinel)
      'ot-g1-02', 'ot-g1-02', 'ot-g1-02', 'ot-g1-02', // 4x Cocoa
      'ot-g1-03', 'ot-g1-03', 'ot-g1-03', 'ot-g1-03', // 4x Gemini
      'ot-g1-02'                                      // 1x Cocoa
    ],
    grade2CardIds: [
      'ot-g2-01', 'ot-g2-01', 'ot-g2-01', 'ot-g2-01', // 4x Silent Tom
      'ot-g2-02', 'ot-g2-02', 'ot-g2-02', 'ot-g2-02', // 4x Wiseman
      'ot-g2-01', 'ot-g2-02', 'ot-g2-01', 'ot-g2-02',
      'ot-g2-01'
    ],
    grade3CardIds: [
      'ot-g3-01', 'ot-g3-01', 'ot-g3-01', 'ot-g3-01', // 4x Amaterasu
      'ot-g3-02', 'ot-g3-02', 'ot-g3-02', 'ot-g3-02', // 4x Meteor Break
      'ot-g3-03', 'ot-g3-03', 'ot-g3-03', 'ot-g3-03', // 4x Sphere Magus (Heal)
      'ot-g3-01'
    ],
    triggerAssignments: {
      '0': 'CRITICAL', '1': 'CRITICAL', '2': 'CRITICAL', '3': 'CRITICAL',
      '4': 'DRAW', '5': 'DRAW', '6': 'DRAW', '7': 'DRAW', '8': 'DRAW',
      '9': 'HEAL', '10': 'HEAL', '11': 'HEAL', '12': 'HEAL'
    }
  }
};

/**
 * Builds an authentic 40-card Vanguard Zero deck array.
 * Starter is set aside as First Vanguard.
 * Remaining 39 cards form the Main Deck (13 G1 + 13 G2 + 13 G3).
 * Grade 3 cards have their assigned trigger applied!
 */
export function buildVanguardZeroDeck(config: DeckConfig): { starter: CardData; mainDeck: CardData[] } {
  const starter = { ...CARD_DATABASE[config.firstVanguardId] };
  const mainDeck: CardData[] = [];

  // Add 13 Grade 1s
  config.grade1CardIds.slice(0, 13).forEach((cardId, index) => {
    const base = CARD_DATABASE[cardId];
    mainDeck.push({
      ...base,
      id: `${base.id}-deck-${index}`
    });
  });

  // Add 13 Grade 2s
  config.grade2CardIds.slice(0, 13).forEach((cardId, index) => {
    const base = CARD_DATABASE[cardId];
    mainDeck.push({
      ...base,
      id: `${base.id}-deck-${index}`
    });
  });

  // Add 13 Grade 3s with configured triggers
  config.grade3CardIds.slice(0, 13).forEach((cardId, index) => {
    const base = CARD_DATABASE[cardId];
    const trigger = config.triggerAssignments[String(index)] || (index < 4 ? 'HEAL' : index < 8 ? 'CRITICAL' : 'DRAW');
    mainDeck.push({
      ...base,
      id: `${base.id}-deck-${index}`,
      triggerType: trigger
    });
  });

  return { starter, mainDeck };
}

/**
 * Shuffles array in place using Fisher-Yates
 */
export function shuffleCards(cards: CardData[]): CardData[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
