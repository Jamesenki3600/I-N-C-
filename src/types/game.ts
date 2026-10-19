export type Clan = 'Royal Paladin' | 'Kagero' | 'Shadow Paladin' | 'Oracle Think Tank' | 'Nova Grappler';

export type Grade = 0 | 1 | 2 | 3;

export type TriggerType = 'NONE' | 'DRAW' | 'CRITICAL' | 'HEAL' | 'STAND';

export type SkillType = 'BOOST' | 'INTERCEPT' | 'TWIN_DRIVE';

export interface CardData {
  id: string;
  name: string;
  clan: Clan;
  grade: Grade;
  power: number;
  shield: number;
  skills: SkillType[];
  triggerType: TriggerType;
  isSentinel?: boolean;
  rarity: 'C' | 'R' | 'RR' | 'RRR';
  imageUrl?: string;
  ability: string;
  flavorText?: string;
}

export type CirclePosition = 
  | 'FRONT_LEFT'
  | 'VANGUARD'
  | 'FRONT_RIGHT'
  | 'BACK_LEFT'
  | 'BACK_CENTER'
  | 'BACK_RIGHT';

export interface FieldUnit {
  id: string;
  card: CardData;
  isRested: boolean;
  tempPowerBonus: number;
  tempCritBonus: number;
  position: CirclePosition;
}

export interface PlayerState {
  name: string;
  clan: Clan;
  avatarUrl?: string;
  vanguard: FieldUnit;
  rearGuards: Partial<Record<CirclePosition, FieldUnit>>;
  hand: CardData[];
  deck: CardData[];
  damageZone: CardData[];
  faceDownDamageCount: number; // for Counter Blast tracking
  dropZone: CardData[];
  soul: CardData[];
  totalDamage: number;
}

export type TurnPhase =
  | 'STAND_AND_DRAW'
  | 'RIDE_PHASE'
  | 'MAIN_PHASE'
  | 'BATTLE_ATTACK_SELECT'
  | 'BATTLE_BOOST_SELECT'
  | 'BATTLE_TARGET_SELECT'
  | 'DRIVE_CHECK'
  | 'DAMAGE_CHECK'
  | 'END_PHASE';

export interface AttackDeclaration {
  attackerPos: CirclePosition;
  boosterPos?: CirclePosition;
  targetPos: CirclePosition;
  attackerPower: number;
  targetPower: number;
  critical: number;
}

export interface DriveCheckResult {
  card: CardData;
  triggerType: TriggerType;
  powerTargetPos?: CirclePosition;
  isSecondDrive?: boolean;
}

export interface GameLogEntry {
  id: string;
  timestamp: string;
  turn: number;
  player: 'PLAYER' | 'OPPONENT';
  message: string;
  type: 'RIDE' | 'CALL' | 'ATTACK' | 'TRIGGER' | 'DAMAGE' | 'INTERCEPT' | 'SENTINEL' | 'HEAL' | 'SYSTEM';
}

export interface DeckConfig {
  id: string;
  name: string;
  clan: Clan;
  firstVanguardId: string;
  grade1CardIds: string[]; // 13 cards
  grade2CardIds: string[]; // 13 cards
  grade3CardIds: string[]; // 13 cards
  // Trigger assignments for Grade 3 cards (must total 13: 4 HEAL, and remaining 9 split among CRIT/DRAW/STAND)
  triggerAssignments: Record<string, TriggerType>;
}
