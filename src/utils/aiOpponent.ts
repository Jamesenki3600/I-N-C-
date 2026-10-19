import { PlayerState, CardData, CirclePosition, FieldUnit } from '../types/game';

export interface AIMove {
  type: 'RIDE' | 'CALL' | 'ATTACK' | 'END_TURN';
  card?: CardData;
  targetPosition?: CirclePosition;
  attackerPosition?: CirclePosition;
  boosterPosition?: CirclePosition;
  attackTarget?: CirclePosition;
}

/**
 * Determines the best ride for the AI from hand.
 */
export function getAIRideChoice(ai: PlayerState): CardData | null {
  const currentGrade = ai.vanguard.card.grade;
  if (currentGrade >= 3) return null; // already at max grade

  const targetGrade = currentGrade + 1;
  const eligibleCards = ai.hand.filter(c => c.grade === targetGrade);

  if (eligibleCards.length === 0) return null;

  // Prefer boss cards or highest rarity
  eligibleCards.sort((a, b) => {
    const rarityScore = { 'RRR': 4, 'RR': 3, 'R': 2, 'C': 1 };
    return (rarityScore[b.rarity] || 0) - (rarityScore[a.rarity] || 0);
  });

  return eligibleCards[0];
}

/**
 * Determines calls for the AI to make during Main Phase.
 * AI prioritizes:
 * 1. Placing Grade 2 units on Front Left & Front Right (for Intercept defense!)
 * 2. Placing Grade 1 units on Back Left, Back Center, Back Right (for Boosting!)
 */
export function getAICalls(ai: PlayerState): { card: CardData; position: CirclePosition }[] {
  const calls: { card: CardData; position: CirclePosition }[] = [];
  const handCopy = [...ai.hand];

  // 1. Check Front Row Intercept positions (FRONT_LEFT, FRONT_RIGHT)
  const frontPositions: CirclePosition[] = ['FRONT_LEFT', 'FRONT_RIGHT'];
  for (const pos of frontPositions) {
    if (!ai.rearGuards[pos]) {
      // Find a Grade 2 in hand
      const g2Index = handCopy.findIndex(c => c.grade === 2);
      if (g2Index !== -1) {
        const card = handCopy.splice(g2Index, 1)[0];
        calls.push({ card, position: pos });
      }
    }
  }

  // 2. Check Back Row Booster positions (BACK_LEFT, BACK_CENTER, BACK_RIGHT)
  const backPositions: CirclePosition[] = ['BACK_LEFT', 'BACK_CENTER', 'BACK_RIGHT'];
  for (const pos of backPositions) {
    if (!ai.rearGuards[pos] && handCopy.length > 2) { // keep some hand cards
      const g1Index = handCopy.findIndex(c => c.grade === 1 && !c.isSentinel);
      if (g1Index !== -1) {
        const card = handCopy.splice(g1Index, 1)[0];
        calls.push({ card, position: pos });
      }
    }
  }

  return calls;
}

/**
 * Finds eligible booster for an attacker in the same column
 */
export function getBoosterForAttacker(ai: PlayerState, attackerPos: CirclePosition): CirclePosition | undefined {
  let boosterPos: CirclePosition | undefined;
  if (attackerPos === 'FRONT_LEFT') boosterPos = 'BACK_LEFT';
  if (attackerPos === 'VANGUARD') boosterPos = 'BACK_CENTER';
  if (attackerPos === 'FRONT_RIGHT') boosterPos = 'BACK_RIGHT';

  if (boosterPos && ai.rearGuards[boosterPos] && !ai.rearGuards[boosterPos]!.isRested) {
    return boosterPos;
  }
  return undefined;
}

/**
 * Vanguard Zero Intercept Check:
 * Does the defending player have Grade 2 units in FRONT_LEFT or FRONT_RIGHT?
 * If yes, attackers CANNOT target the Vanguard! They MUST target an active Interceptor!
 */
export function getPlayerInterceptors(player: PlayerState): CirclePosition[] {
  const interceptors: CirclePosition[] = [];
  const frontLeft = player.rearGuards['FRONT_LEFT'];
  const frontRight = player.rearGuards['FRONT_RIGHT'];

  if (frontLeft && frontLeft.card.grade === 2) {
    interceptors.push('FRONT_LEFT');
  }
  if (frontRight && frontRight.card.grade === 2) {
    interceptors.push('FRONT_RIGHT');
  }
  return interceptors;
}

/**
 * Determine the next attack declaration for the AI
 */
export function getNextAIAttack(
  ai: PlayerState,
  player: PlayerState
): { attacker: CirclePosition; booster?: CirclePosition; target: CirclePosition } | null {
  // Possible attackers: FRONT_LEFT, VANGUARD, FRONT_RIGHT that are NOT rested
  const candidateAttackers: CirclePosition[] = [];
  if (ai.rearGuards['FRONT_LEFT'] && !ai.rearGuards['FRONT_LEFT']!.isRested) {
    candidateAttackers.push('FRONT_LEFT');
  }
  if (!ai.vanguard.isRested) {
    candidateAttackers.push('VANGUARD');
  }
  if (ai.rearGuards['FRONT_RIGHT'] && !ai.rearGuards['FRONT_RIGHT']!.isRested) {
    candidateAttackers.push('FRONT_RIGHT');
  }

  if (candidateAttackers.length === 0) {
    return null; // All done attacking
  }

  // Determine attack target under Vanguard Zero Intercept rules
  const playerInterceptors = getPlayerInterceptors(player);

  let target: CirclePosition;
  if (playerInterceptors.length > 0) {
    // Zero rule: MUST attack front-row Grade 2 first!
    target = playerInterceptors[0];
  } else {
    // Intercepts are clear! Attack the Vanguard!
    target = 'VANGUARD';
  }

  // Attack order: In Zero, players usually attack with Rear-guard first to test triggers,
  // then Vanguard (for Twin Drive triggers that can boost standing Rear-guards or deal game-winning damage).
  // If we have rear-guard attackers, use one of them first.
  let attacker: CirclePosition;
  const rgAttackers = candidateAttackers.filter(p => p !== 'VANGUARD');
  if (rgAttackers.length > 0 && playerInterceptors.length > 0) {
    attacker = rgAttackers[0];
  } else if (!ai.vanguard.isRested) {
    attacker = 'VANGUARD';
  } else {
    attacker = candidateAttackers[0];
  }

  const booster = getBoosterForAttacker(ai, attacker);

  return { attacker, booster, target };
}
