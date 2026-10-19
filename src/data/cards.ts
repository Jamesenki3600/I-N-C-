import { CardData } from '../types/game';

// Card pool for Vanguard Zero Revival
export const CARD_DATABASE: Record<string, CardData> = {
  // ==========================================
  // ROYAL PALADIN
  // ==========================================
  // Grade 0
  'rp-g0-01': {
    id: 'rp-g0-01',
    name: 'Barcgal',
    clan: 'Royal Paladin',
    grade: 0,
    power: 4000,
    shield: 10000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[First Vanguard] When ridden upon, moves to Rear-guard. [ACT](RC): [Rest this unit] Search your deck for a Grade 1 Royal Paladin and add to hand or call.',
    flavorText: 'Run, young brave dog! The legendary knight will answer your call!'
  },
  'rp-g0-02': {
    id: 'rp-g0-02',
    name: 'Stardust Trumpeter',
    clan: 'Royal Paladin',
    grade: 0,
    power: 5000,
    shield: 10000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[First Vanguard] When another Royal Paladin rides this unit, you may call this card to an open Rear-guard circle.',
    flavorText: 'The sound of the trumpet heralds the arrival of a new vanguard.'
  },
  // Grade 1
  'rp-g1-01': {
    id: 'rp-g1-01',
    name: 'Little Sage, Marron',
    clan: 'Royal Paladin',
    grade: 1,
    power: 8000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: 'A steadfast scholar whose potent magical support bolsters the front line knights.',
    flavorText: 'Courage is born from true wisdom.'
  },
  'rp-g1-02': {
    id: 'rp-g1-02',
    name: 'Flash Shield, Iseult',
    clan: 'Royal Paladin',
    grade: 1,
    power: 6000,
    shield: 0,
    skills: ['BOOST'],
    triggerType: 'NONE',
    isSentinel: true,
    rarity: 'RR',
    imageUrl: '/src/assets/images/card_iseult_shield_1792440223360.jpg',
    ability: '[Sentinel / Perfect Guard] When your Vanguard is attacked and would take lethal damage or 2+ damage, automatically activates from hand: discard 1 card, that attack cannot hit!',
    flavorText: 'The holy flash of the shield repels even calamity itself!'
  },
  'rp-g1-03': {
    id: 'rp-g1-03',
    name: 'Wingal',
    clan: 'Royal Paladin',
    grade: 1,
    power: 6000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[AUTO](RC): When boosting a unit with "Blaster" in its card name, the boosted unit gets +4000 Power during that battle (+10,000 Boost total!).',
    flavorText: 'Heed the call of the blue blade, faithful beast of the winds!'
  },
  'rp-g1-04': {
    id: 'rp-g1-04',
    name: 'Pongal',
    clan: 'Royal Paladin',
    grade: 1,
    power: 7000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[AUTO]: When placed on Rear-guard circle, Soul Charge 1. If your Vanguard is Grade 3, you may search your deck for "Soul Saver Dragon" and add it to your hand.',
    flavorText: 'The pure spirit fuels the sacred sanctuary soul.'
  },
  'rp-g1-05': {
    id: 'rp-g1-05',
    name: 'Lake Maiden, Lien',
    clan: 'Royal Paladin',
    grade: 1,
    power: 7000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[ACT](RC): [Rest this unit & discard a card] Draw 1 card. Cycles through the deck for key combo pieces.',
    flavorText: 'Gaze into the clear lake, and see your destined fate.'
  },
  // Grade 2
  'rp-g2-01': {
    id: 'rp-g2-01',
    name: 'Blaster Blade',
    clan: 'Royal Paladin',
    grade: 2,
    power: 9000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_blaster_blade_1792296040823.jpg',
    ability: '[Intercept] [AUTO]: When placed on Vanguard or Rear-guard circle: [Counter Blast 2] Retire 1 of your opponent\'s Rear-guards! (Grade 2 or higher if Vanguard, any Grade 2 or less if Rear-guard).',
    flavorText: 'Courage, heed my sword! Slash open the path to the future! Burst into light, Blaster Blade!'
  },
  'rp-g2-02': {
    id: 'rp-g2-02',
    name: 'Knight of Silence, Gallatin',
    clan: 'Royal Paladin',
    grade: 2,
    power: 10000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[Intercept] High base 10,000 Power shield knight. Forms an impenetrable front-row defense.',
    flavorText: 'A warrior of true conviction needs no boastful words.'
  },
  'rp-g2-03': {
    id: 'rp-g2-03',
    name: 'High Dog Breeder, Akane',
    clan: 'Royal Paladin',
    grade: 2,
    power: 8000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RR',
    ability: '[Intercept] [AUTO]: When placed on Rear-guard circle: [Counter Blast 2] Search your deck for a Grade 1 High Beast ("Pongal" or "Wingal") and superior call it to an open RC.',
    flavorText: 'Go forth, my loyal companions! Guard our allies with your lives!'
  },
  'rp-g2-04': {
    id: 'rp-g2-04',
    name: 'Knight of the Harp, Tristram',
    clan: 'Royal Paladin',
    grade: 2,
    power: 9000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[Intercept] Melodic warrior whose martial harmony maintains Royal Paladin battle formation.',
    flavorText: 'Even the fierce chaos of war can be quieted by a song of hope.'
  },
  // Grade 3
  'rp-g3-01': {
    id: 'rp-g3-01',
    name: 'King of Knights, Alfred',
    clan: 'Royal Paladin',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_king_alfred_1792440223323.jpg',
    ability: '[Twin Drive] [CONT](VC): This unit cannot be boosted. [CONT](VC): During your turn, this unit gets +2000 Power for each of your Royal Paladin Rear-guards! (Up to +10,000 Power!). [ACT](VC): [Counter Blast 3] Superior call 1 Grade 2 or lower Royal Paladin from your deck.',
    flavorText: 'Together with my brave knights, we shall bring peace to the sanctuary!'
  },
  'rp-g3-02': {
    id: 'rp-g3-02',
    name: 'Soul Saver Dragon',
    clan: 'Royal Paladin',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_soul_saver_1792440223168.jpg',
    ability: '[Twin Drive] [AUTO](VC): When placed on Vanguard circle: [Soul Blast 5] "Holy Charging Roar!" Up to three of your Royal Paladin Rear-guards get +5000 Power until end of turn! Overwhelms opponent intercepts!',
    flavorText: 'Awaken, sacred beast of salvation! Bathe the realm in pure white light!'
  },
  'rp-g3-03': {
    id: 'rp-g3-03',
    name: 'Solitary Knight, Gancelot',
    clan: 'Royal Paladin',
    grade: 3,
    power: 9000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'HEAL',
    rarity: 'RR',
    ability: '[Twin Drive] [Trigger: HEAL] [ACT](Hand): Put this card into the deck and shuffle: Search your deck for a "Blaster Blade" and add it to your hand.',
    flavorText: 'Though I walk the path of solitude, my sword protects the weak.'
  },
  'rp-g3-04': {
    id: 'rp-g3-04',
    name: 'Crimson Butterfly, Brigitte',
    clan: 'Royal Paladin',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'CRITICAL',
    rarity: 'R',
    ability: '[Twin Drive] [Trigger: CRITICAL] [AUTO](VC): When this unit\'s drive check reveals a Royal Paladin trigger, this unit gets +3000 Power until end of turn.',
    flavorText: 'Like a scarlet butterfly dancing across the battlefield.'
  },

  // ==========================================
  // KAGERO
  // ==========================================
  // Grade 0
  'kg-g0-01': {
    id: 'kg-g0-01',
    name: 'Lizard Runner, Conroe',
    clan: 'Kagero',
    grade: 0,
    power: 5000,
    shield: 10000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'RR',
    ability: '[First Vanguard] When ridden upon, moves to Rear-guard. [ACT](RC): [Counter Blast 1 & Put this unit into soul] Search your deck for any Grade 1 or less Kagero and add it to hand.',
    flavorText: 'Conroe navigates the sea of flames with unmatched agility.'
  },
  // Grade 1
  'kg-g1-01': {
    id: 'kg-g1-01',
    name: 'Embodiment of Armor, Bahr',
    clan: 'Kagero',
    grade: 1,
    power: 8000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: 'Stalwart armored beast whose immense physical stature provides a fierce 8000 boost.',
    flavorText: 'Armor forged in the fires of the volcanic empire.'
  },
  'kg-g1-02': {
    id: 'kg-g1-02',
    name: 'Wyvern Guard, Barri',
    clan: 'Kagero',
    grade: 1,
    power: 6000,
    shield: 0,
    skills: ['BOOST'],
    triggerType: 'NONE',
    isSentinel: true,
    rarity: 'RR',
    ability: '[Sentinel / Perfect Guard] When your Vanguard is attacked and would take lethal damage or 2+ damage, automatically activates from hand: discard 1 card, that attack cannot hit!',
    flavorText: 'A wall of impenetrable flame that consumes all incoming blows!'
  },
  'kg-g1-03': {
    id: 'kg-g1-03',
    name: 'Dragon Monk, Gojo',
    clan: 'Kagero',
    grade: 1,
    power: 7000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[ACT](RC): [Rest this unit & discard a card] Draw 1 card. Cycles through the deck for Dragonic Overlord.',
    flavorText: 'The smoke of meditation reveals the true dragon path.'
  },
  // Grade 2
  'kg-g2-01': {
    id: 'kg-g2-01',
    name: 'Berserk Dragon',
    clan: 'Kagero',
    grade: 2,
    power: 9000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RR',
    ability: '[Intercept] [AUTO]: When placed on Vanguard or Rear-guard circle: [Counter Blast 2] Retire 1 of your opponent\'s Grade 2 or less Rear-guards! (Destroys enemy intercepts!).',
    flavorText: 'Its ferocious roar burns down the battlefield without mercy!'
  },
  'kg-g2-02': {
    id: 'kg-g2-02',
    name: 'Dragon Knight, Nehalem',
    clan: 'Kagero',
    grade: 2,
    power: 10000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[Intercept] Elite 10,000 Power dragon knight. Dominates the front-line combat zone.',
    flavorText: 'He rides alongside dragons, fearless in the face of molten doom.'
  },
  'kg-g2-03': {
    id: 'kg-g2-03',
    name: 'Bellicosity Dragon',
    clan: 'Kagero',
    grade: 2,
    power: 9000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[Intercept] [AUTO](RC): When this unit\'s attack hits the Vanguard, if your Vanguard is Kagero, unflip 1 card in your Damage Zone (Counter Charge 1!).',
    flavorText: 'Its strikes convert battle fury into burning fuel.'
  },
  // Grade 3
  'kg-g3-01': {
    id: 'kg-g3-01',
    name: 'Dragonic Overlord',
    clan: 'Kagero',
    grade: 3,
    power: 11000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_dragonic_overlord_1792296053213.jpg',
    ability: '[Twin Drive] [AUTO](VC): [Counter Blast 3] When this unit\'s attack hits an opponent\'s Rear-guard: Stand this unit! (Loses Twin Drive for subsequent attacks). Can wipe out all opponent intercepts and still strike the Vanguard!',
    flavorText: 'Bow down before the absolute emperor of the flame skies! Eternal Apocalypse!'
  },
  'kg-g3-02': {
    id: 'kg-g3-02',
    name: 'Vortex Dragon',
    clan: 'Kagero',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    ability: '[Twin Drive] [ACT](VC): [Soul Blast 8 & Counter Blast 5] "Mega Blast!" Retire three of your opponent\'s Rear-guards at once, incinerating their entire defensive line!',
    flavorText: 'Whirlwind of volcanic hellfire, sweep away all existence!'
  },
  'kg-g3-03': {
    id: 'kg-g3-03',
    name: 'Dragonic Executioner',
    clan: 'Kagero',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'CRITICAL',
    rarity: 'R',
    ability: '[Twin Drive] [Trigger: CRITICAL] [AUTO](VC/RC): When this unit attacks a Vanguard, if your opponent has two or fewer Rear-guards, this unit gets +3000 Power.',
    flavorText: 'Execution is the only judgment for those who stand against the dragon emperor.'
  },
  'kg-g3-04': {
    id: 'kg-g3-04',
    name: 'Dragon Monk, Genjo',
    clan: 'Kagero',
    grade: 3,
    power: 9000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'HEAL',
    rarity: 'C',
    ability: '[Twin Drive] [Trigger: HEAL] In Zero, triggers are assigned to Grade 3 units. Heals 1 damage when checked if damage >= opponent.',
    flavorText: 'May the healing flames soothe the spirits of the fallen.'
  },

  // ==========================================
  // SHADOW PALADIN
  // ==========================================
  // Grade 0
  'sp-g0-01': {
    id: 'sp-g0-01',
    name: 'Fullbau',
    clan: 'Shadow Paladin',
    grade: 0,
    power: 4000,
    shield: 10000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[First Vanguard] When "Blaster Javelin" rides this unit, search your deck for up to one "Blaster Dark", and add it to your hand.',
    flavorText: 'The black pup who guides the shadows of destiny.'
  },
  // Grade 1
  'sp-g1-01': {
    id: 'sp-g1-01',
    name: 'Blaster Javelin',
    clan: 'Shadow Paladin',
    grade: 1,
    power: 8000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[AUTO]: When this unit rides "Fullbau", search your deck for "Blaster Dark" and add to hand. [ACT](RC): [Discard a Grade 3] Search deck for "Phantom Blaster Dragon".',
    flavorText: 'Pierce the light! Let the shadowy abyss consume all.'
  },
  'sp-g1-02': {
    id: 'sp-g1-02',
    name: 'Dark Shield, Mac Lir',
    clan: 'Shadow Paladin',
    grade: 1,
    power: 6000,
    shield: 0,
    skills: ['BOOST'],
    triggerType: 'NONE',
    isSentinel: true,
    rarity: 'RR',
    ability: '[Sentinel / Perfect Guard] When your Vanguard is attacked and would take lethal damage or 2+ damage, automatically activates from hand: discard 1 card, that attack cannot hit!',
    flavorText: 'A veil of darkness that swallows every holy light!'
  },
  'sp-g1-03': {
    id: 'sp-g1-03',
    name: 'Black Sage, Charon',
    clan: 'Shadow Paladin',
    grade: 1,
    power: 8000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: 'Cynical sage whose dark sorcery enhances the destructive power of Shadow Paladin columns.',
    flavorText: 'Sacrifice is the currency of true power.'
  },
  // Grade 2
  'sp-g2-01': {
    id: 'sp-g2-01',
    name: 'Blaster Dark',
    clan: 'Shadow Paladin',
    grade: 2,
    power: 9000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RRR',
    ability: '[Intercept] [AUTO]: When placed on Vanguard circle: [Counter Blast 2] Retire 1 of your opponent\'s front-row Rear-guards! (If you have "Blaster Javelin" in soul, Counter Blast cost is reduced by 1!).',
    flavorText: 'I shall plunge this world into pitch-black despair! Blaster Dark!'
  },
  'sp-g2-02': {
    id: 'sp-g2-02',
    name: 'Darkness Maiden, Macha',
    clan: 'Shadow Paladin',
    grade: 2,
    power: 8000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RR',
    ability: '[Intercept] [AUTO]: When this unit attacks a Vanguard, if your Vanguard is Shadow Paladin: [Counter Blast 2] Superior call 1 Grade 1 or less Shadow Paladin from deck.',
    flavorText: 'Awaken, shadow warriors. Offer your souls to our lord.'
  },
  'sp-g2-03': {
    id: 'sp-g2-03',
    name: 'Skull Witch, Nemain',
    clan: 'Shadow Paladin',
    grade: 2,
    power: 5000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RR',
    ability: '[Intercept] [AUTO]: When placed on Rear-guard circle: [Counter Blast 1 & Discard 1 card] Draw 2 cards. Refills hand to find Sentinels and Grade 3s.',
    flavorText: 'Hehehe... let us trade your past for a glimpse of death.'
  },
  // Grade 3
  'sp-g3-01': {
    id: 'sp-g3-01',
    name: 'Phantom Blaster Dragon',
    clan: 'Shadow Paladin',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_phantom_dragon_1792296065334.jpg',
    ability: '[Twin Drive] [ACT](VC): [Counter Blast 2 & Retire 3 of your Shadow Paladin Rear-guards] "Damned Charging Lance!" This unit gets +10,000 Power and +1 Critical until end of turn! (A devastating 20k+ 2-damage attack that pressures Sentinels!).',
    flavorText: 'Embrace the darkness and despair! Damned Charging Lance!'
  },
  'sp-g3-02': {
    id: 'sp-g3-02',
    name: 'The Dark Dictator',
    clan: 'Shadow Paladin',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'CRITICAL',
    rarity: 'RR',
    ability: '[Twin Drive] [Trigger: CRITICAL] [CONT](VC): During your turn, this unit gets +2000 Power for each Shadow Paladin Rear-guard you control. [AUTO](VC): [Soul Blast 3] Give two front row units +5000 Power.',
    flavorText: 'Rule through ruthless might. Mercy is for the weak.'
  },
  'sp-g3-03': {
    id: 'sp-g3-03',
    name: 'Grim Reaper',
    clan: 'Shadow Paladin',
    grade: 3,
    power: 9000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'HEAL',
    rarity: 'C',
    ability: '[Twin Drive] [Trigger: HEAL] In Zero, triggers are assigned to Grade 3 units. Heals 1 damage when checked if damage >= opponent.',
    flavorText: 'Death visits all equally, bringing silence and respite.'
  },

  // ==========================================
  // ORACLE THINK TANK
  // ==========================================
  // Grade 0
  'ot-g0-01': {
    id: 'ot-g0-01',
    name: 'Godhawk, Ichibyoshi',
    clan: 'Oracle Think Tank',
    grade: 0,
    power: 5000,
    shield: 10000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[First Vanguard] When ridden upon by "Goddess of the Crescent Moon, Tsukuyomi", check top 5 cards and ride from among them.',
    flavorText: 'The sacred hawk perches upon the boundary of time.'
  },
  // Grade 1
  'ot-g1-01': {
    id: 'ot-g1-01',
    name: 'Battle Sister, Chocolat',
    clan: 'Oracle Think Tank',
    grade: 1,
    power: 6000,
    shield: 0,
    skills: ['BOOST'],
    triggerType: 'NONE',
    isSentinel: true,
    rarity: 'RR',
    ability: '[Sentinel / Perfect Guard] When your Vanguard is attacked and would take lethal damage or 2+ damage, automatically activates from hand: discard 1 card, that attack cannot hit!',
    flavorText: 'Taste my sweet barrier! You shall not pass!'
  },
  'ot-g1-02': {
    id: 'ot-g1-02',
    name: 'Battle Sister, Cocoa',
    clan: 'Oracle Think Tank',
    grade: 1,
    power: 7000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'R',
    ability: '[AUTO]: When placed on Vanguard or Rear-guard circle, look at the top card of your deck, and put it on top or bottom of your deck (Scry 1). Sets up guaranteed triggers!',
    flavorText: 'I can see what is coming next! Ready your cards!'
  },
  'ot-g1-03': {
    id: 'ot-g1-03',
    name: 'Oracle Guardian, Gemini',
    clan: 'Oracle Think Tank',
    grade: 1,
    power: 8000,
    shield: 5000,
    skills: ['BOOST'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: 'Solid 8000 power booster providing stable offensive backing.',
    flavorText: 'Duality in thought, unity in prediction.'
  },
  // Grade 2
  'ot-g2-01': {
    id: 'ot-g2-01',
    name: 'Silent Tom',
    clan: 'Oracle Think Tank',
    grade: 2,
    power: 8000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_silent_tom_1792440224236.jpg',
    ability: '[Intercept] [CONT](RC): When this unit attacks a Vanguard, if you have an Oracle Think Tank Vanguard, your opponent cannot guard with Grade 0 cards! In Zero, Tom\'s attacks cannot be intercepted if the opponent\'s interceptors are rested!',
    flavorText: 'Bang. Silence is golden, but lead is swift.'
  },
  'ot-g2-02': {
    id: 'ot-g2-02',
    name: 'Oracle Guardian, Wiseman',
    clan: 'Oracle Think Tank',
    grade: 2,
    power: 10000,
    shield: 5000,
    skills: ['INTERCEPT'],
    triggerType: 'NONE',
    rarity: 'C',
    ability: '[Intercept] 10,000 power defensive intercept unit.',
    flavorText: 'A wall of ancient prophecies protects the shrine.'
  },
  // Grade 3
  'ot-g3-01': {
    id: 'ot-g3-01',
    name: 'CEO Amaterasu',
    clan: 'Oracle Think Tank',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'NONE',
    rarity: 'RRR',
    imageUrl: '/src/assets/images/card_ceo_amaterasu_1792440224204.jpg',
    ability: '[Twin Drive] [AUTO](VC): At the start of your turn, Soul Charge 1 and look at top card of your deck; put it on top or bottom. [CONT](VC): During your turn, if you have 4 or more cards in hand, this unit gets +4000 Power! [ACT](VC): [Mega Blast] Draw 5 cards.',
    flavorText: 'May the radiant sun goddess illuminate our victorious future!'
  },
  'ot-g3-02': {
    id: 'ot-g3-02',
    name: 'Meteor Break Wizard',
    clan: 'Oracle Think Tank',
    grade: 3,
    power: 10000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'CRITICAL',
    rarity: 'R',
    ability: '[Twin Drive] [Trigger: CRITICAL] [AUTO](VC): When this unit attacks, if your hand size is 4 or more, gets +3000 Power.',
    flavorText: 'Starlight bends to the will of the cosmic oracle.'
  },
  'ot-g3-03': {
    id: 'ot-g3-03',
    name: 'Sphere Magus',
    clan: 'Oracle Think Tank',
    grade: 3,
    power: 9000,
    shield: 0,
    skills: ['TWIN_DRIVE'],
    triggerType: 'HEAL',
    rarity: 'C',
    ability: '[Twin Drive] [Trigger: HEAL] In Zero, triggers are assigned to Grade 3 units. Heals 1 damage when checked if damage >= opponent.',
    flavorText: 'The crystal sphere reflects peaceful restorative energy.'
  }
};

export const ALL_CARDS = Object.values(CARD_DATABASE);
