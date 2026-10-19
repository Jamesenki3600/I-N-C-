import React, { useState, useEffect, useRef } from 'react';
import {
  PlayerState,
  CirclePosition,
  FieldUnit,
  CardData,
  TurnPhase,
  GameLogEntry,
  DeckConfig,
  TriggerType
} from '../types/game';
import { CARD_DATABASE } from '../data/cards';
import { buildVanguardZeroDeck, shuffleCards } from '../data/decks';
import { sounds } from '../utils/soundEffects';
import { getAIRideChoice, getAICalls, getNextAIAttack, getPlayerInterceptors } from '../utils/aiOpponent';
import { FieldCircle } from './FieldCircle';
import { CardView } from './CardView';
import { DriveCheckModal } from './DriveCheckModal';
import { DamageCheckModal } from './DamageCheckModal';
import { SentinelActivationModal } from './SentinelActivationModal';
import { CombatLog } from './CombatLog';
import { CardBack } from './CardBack';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Swords,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Flag,
  Layers,
  Flame,
  Award
} from 'lucide-react';

interface BattleArenaProps {
  playerDeckConfig: DeckConfig;
  opponentDeckConfig: DeckConfig;
  onSelectCardInspect: (card: CardData) => void;
  onOpenDeckBuilder: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  playerDeckConfig,
  opponentDeckConfig,
  onSelectCardInspect,
  onOpenDeckBuilder,
}) => {
  // Game Setup & Turn States
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [turnPlayer, setTurnPlayer] = useState<'PLAYER' | 'OPPONENT'>('PLAYER');
  const [phase, setPhase] = useState<TurnPhase>('RIDE_PHASE');
  const [winner, setWinner] = useState<'PLAYER' | 'OPPONENT' | null>(null);

  // Players' full board states
  const [player, setPlayer] = useState<PlayerState>(() => createInitialState(playerDeckConfig, 'You'));
  const [opponent, setOpponent] = useState<PlayerState>(() => createInitialState(opponentDeckConfig, opponentDeckConfig.clan + ' Duelist'));

  // Interactive Battle Selection States
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<CirclePosition | null>(null);
  const [selectedBooster, setSelectedBooster] = useState<CirclePosition | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Modals for Trigger & Sentinel Cut-ins
  const [driveCheckState, setDriveCheckState] = useState<{
    card: CardData;
    isSecond: boolean;
    total: number;
    trigger: TriggerType;
    attackerName: string;
    isOpponent: boolean;
  } | null>(null);

  const [damageCheckState, setDamageCheckState] = useState<{
    card: CardData;
    trigger: TriggerType;
    currentDamage: number;
    maxDamage: number;
    isOpponent: boolean;
    healed: boolean;
  } | null>(null);

  const [sentinelState, setSentinelState] = useState<{
    sentinelCard: CardData;
    defenderName: string;
    attackerName: string;
  } | null>(null);

  // Combat Log
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize player state
  function createInitialState(config: DeckConfig, name: string): PlayerState {
    const { starter, mainDeck } = buildVanguardZeroDeck(config);
    const shuffled = shuffleCards(mainDeck);

    // Initial hand of 5 cards
    const initialHand = shuffled.slice(0, 5);
    const remainingDeck = shuffled.slice(5);

    const vanguardUnit: FieldUnit = {
      id: `${starter.id}-init`,
      card: starter,
      isRested: false,
      tempPowerBonus: 0,
      tempCritBonus: 0,
      position: 'VANGUARD'
    };

    return {
      name,
      clan: config.clan,
      vanguard: vanguardUnit,
      rearGuards: {},
      hand: initialHand,
      deck: remainingDeck,
      damageZone: [],
      faceDownDamageCount: 0,
      dropZone: [],
      soul: [],
      totalDamage: 0
    };
  }

  // Add an entry to the combat log
  const addLog = (
    playerType: 'PLAYER' | 'OPPONENT',
    type: GameLogEntry['type'],
    message: string
  ) => {
    const entry: GameLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      turn: turnNumber,
      player: playerType,
      type,
      message
    };
    setLogs((prev) => [entry, ...prev]);
  };

  // Start the fight: "Stand Up, (THE) Vanguard!"
  const handleStandUpVanguard = () => {
    sounds.playStandUp();
    setHasStarted(true);
    addLog('PLAYER', 'SYSTEM', 'Stand up, THE Vanguard! The fight has begun!');
  };

  // Reset Fight
  const handleRestartFight = () => {
    setPlayer(createInitialState(playerDeckConfig, 'You'));
    setOpponent(createInitialState(opponentDeckConfig, opponentDeckConfig.clan + ' Duelist'));
    setTurnNumber(1);
    setTurnPlayer('PLAYER');
    setPhase('RIDE_PHASE');
    setWinner(null);
    setSelectedHandIndex(null);
    setSelectedAttacker(null);
    setSelectedBooster(null);
    setLogs([]);
    setHasStarted(false);
  };

  // Toggle Sound FX
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Check if player has valid interceptors on front row
  const opponentInterceptors = getPlayerInterceptors(opponent);
  const playerInterceptors = getPlayerInterceptors(player);

  // =========================================================================
  // PLAYER ACTIONS
  // =========================================================================

  // Ride Phase: Player rides a card from hand onto Vanguard circle
  const handlePlayerRide = (handIdx: number) => {
    const card = player.hand[handIdx];
    if (card.grade !== player.vanguard.card.grade + 1 && card.grade !== player.vanguard.card.grade) {
      return; // Must ride on curve or same grade
    }

    sounds.playRide();

    // In Zero, First Vanguard moves to rear-guard if riding Grade 1 onto Grade 0
    const currentVgCard = player.vanguard.card;
    let updatedRearGuards = { ...player.rearGuards };

    if (currentVgCard.grade === 0) {
      // Move starter to BACK_CENTER if empty, else BACK_LEFT/BACK_RIGHT
      const targetPos: CirclePosition = !updatedRearGuards['BACK_CENTER']
        ? 'BACK_CENTER'
        : !updatedRearGuards['BACK_LEFT']
        ? 'BACK_LEFT'
        : 'BACK_RIGHT';

      updatedRearGuards[targetPos] = {
        id: `${currentVgCard.id}-fv`,
        card: currentVgCard,
        isRested: false,
        tempPowerBonus: 0,
        tempCritBonus: 0,
        position: targetPos
      };
      addLog('PLAYER', 'RIDE', `Starter ${currentVgCard.name} moved to Rear-guard circle!`);
    }

    // Put current VG card into soul
    const newSoul = [...player.soul, currentVgCard];

    // New Vanguard
    const newVanguard: FieldUnit = {
      id: `${card.id}-${Date.now()}`,
      card,
      isRested: false,
      tempPowerBonus: 0,
      tempCritBonus: 0,
      position: 'VANGUARD'
    };

    setPlayer((prev) => ({
      ...prev,
      vanguard: newVanguard,
      rearGuards: updatedRearGuards,
      hand: prev.hand.filter((_, i) => i !== handIdx),
      soul: newSoul
    }));

    addLog('PLAYER', 'RIDE', `Rode Grade ${card.grade} ${card.name} onto Vanguard!`);
    setSelectedHandIndex(null);
    setPhase('MAIN_PHASE');
  };

  // Main Phase: Call unit from hand to Rear-guard circle
  const handlePlayerCall = (pos: CirclePosition) => {
    if (selectedHandIndex === null) return;
    const card = player.hand[selectedHandIndex];
    if (pos === 'VANGUARD') return; // Cannot call to VG

    sounds.playCall();

    const newUnit: FieldUnit = {
      id: `${card.id}-${Date.now()}`,
      card,
      isRested: false,
      tempPowerBonus: 0,
      tempCritBonus: 0,
      position: pos
    };

    setPlayer((prev) => ({
      ...prev,
      rearGuards: {
        ...prev.rearGuards,
        [pos]: newUnit
      },
      hand: prev.hand.filter((_, i) => i !== selectedHandIndex)
    }));

    addLog('PLAYER', 'CALL', `Called ${card.name} to ${pos.replace('_', ' ')}!`);
    setSelectedHandIndex(null);
  };

  // Skill Activation (e.g., Blaster Blade Counter Blast 2 Retire)
  const handleActivateSkill = (pos: CirclePosition) => {
    const unit = pos === 'VANGUARD' ? player.vanguard : player.rearGuards[pos];
    if (!unit) return;

    if (unit.card.name === 'Blaster Blade') {
      // Counter Blast 2 to retire opponent front row rear-guard
      const availableCB = player.damageZone.length - player.faceDownDamageCount;
      if (availableCB < 2) {
        addLog('PLAYER', 'SYSTEM', 'Not enough Counter Blast available (requires 2 face-up damage).');
        return;
      }

      // Check opponent front row
      const frontTargets = (['FRONT_LEFT', 'FRONT_RIGHT'] as CirclePosition[]).filter(
        p => opponent.rearGuards[p]
      );

      if (frontTargets.length === 0) {
        addLog('PLAYER', 'SYSTEM', 'No opponent front-row rear-guards to retire.');
        return;
      }

      const targetPos = frontTargets[0];
      const targetUnit = opponent.rearGuards[targetPos]!;

      sounds.playAttack();

      setPlayer(prev => ({ ...prev, faceDownDamageCount: prev.faceDownDamageCount + 2 }));
      setOpponent(prev => {
        const updatedRG = { ...prev.rearGuards };
        delete updatedRG[targetPos];
        return {
          ...prev,
          rearGuards: updatedRG,
          dropZone: [...prev.dropZone, targetUnit.card]
        };
      });

      addLog('PLAYER', 'INTERCEPT', `Blaster Blade: Counter Blast 2! Retired opponent's ${targetUnit.card.name}! Intercept cleared!`);
    } else if (unit.card.name === 'King of Knights, Alfred' && pos === 'VANGUARD') {
      // Alfred CONT bonus: +2000 for each rear-guard
      const rgCount = Object.keys(player.rearGuards).length;
      addLog('PLAYER', 'SYSTEM', `King of Knights, Alfred gets +${rgCount * 2000} Power from ${rgCount} rear-guards!`);
    }
  };

  // Battle Phase: Select Attacker
  const handleSelectAttacker = (pos: CirclePosition) => {
    if (phase !== 'MAIN_PHASE' && phase !== 'BATTLE_ATTACK_SELECT') return;

    const unit = pos === 'VANGUARD' ? player.vanguard : player.rearGuards[pos];
    if (!unit || unit.isRested) return;

    // Only front row can declare attacks
    if (pos !== 'FRONT_LEFT' && pos !== 'VANGUARD' && pos !== 'FRONT_RIGHT') return;

    setSelectedAttacker(pos);

    // Auto-select booster behind this unit if standing
    let boosterPos: CirclePosition | null = null;
    if (pos === 'FRONT_LEFT' && player.rearGuards['BACK_LEFT'] && !player.rearGuards['BACK_LEFT']!.isRested) {
      boosterPos = 'BACK_LEFT';
    } else if (pos === 'VANGUARD' && player.rearGuards['BACK_CENTER'] && !player.rearGuards['BACK_CENTER']!.isRested) {
      boosterPos = 'BACK_CENTER';
    } else if (pos === 'FRONT_RIGHT' && player.rearGuards['BACK_RIGHT'] && !player.rearGuards['BACK_RIGHT']!.isRested) {
      boosterPos = 'BACK_RIGHT';
    }
    setSelectedBooster(boosterPos);

    setPhase('BATTLE_TARGET_SELECT');
  };

  // Battle Phase: Select Target & Execute Attack
  const handleSelectTarget = (targetPos: CirclePosition) => {
    if (!selectedAttacker) return;

    // MANDATORY VANGUARD ZERO INTERCEPT CHECK
    if (opponentInterceptors.length > 0 && targetPos === 'VANGUARD') {
      sounds.playIntercept();
      addLog('OPPONENT', 'INTERCEPT', 'Vanguard ZERO Rule: Opponent has Grade 2 Interceptor(s) in the front row! You MUST attack the Interceptor first!');
      return;
    }

    executeAttack(
      'PLAYER',
      selectedAttacker,
      selectedBooster || undefined,
      targetPos
    );
  };

  // Attack Execution Engine
  const executeAttack = (
    attackerSide: 'PLAYER' | 'OPPONENT',
    attackerPos: CirclePosition,
    boosterPos: CirclePosition | undefined,
    targetPos: CirclePosition
  ) => {
    const attackingPlayer = attackerSide === 'PLAYER' ? player : opponent;
    const defendingPlayer = attackerSide === 'PLAYER' ? opponent : player;

    const attackerUnit = attackerPos === 'VANGUARD' ? attackingPlayer.vanguard : attackingPlayer.rearGuards[attackerPos]!;
    const boosterUnit = boosterPos ? attackingPlayer.rearGuards[boosterPos] : undefined;
    const targetUnit = targetPos === 'VANGUARD' ? defendingPlayer.vanguard : defendingPlayer.rearGuards[targetPos];

    if (!attackerUnit || !targetUnit) return;

    sounds.playAttack();

    // Rest attacker and booster
    if (attackerSide === 'PLAYER') {
      setPlayer((prev) => {
        const updatedRG = { ...prev.rearGuards };
        if (attackerPos === 'VANGUARD') {
          return {
            ...prev,
            vanguard: { ...prev.vanguard, isRested: true },
            rearGuards: boosterPos && updatedRG[boosterPos] ? {
              ...updatedRG,
              [boosterPos]: { ...updatedRG[boosterPos]!, isRested: true }
            } : updatedRG
          };
        } else {
          updatedRG[attackerPos] = { ...updatedRG[attackerPos]!, isRested: true };
          if (boosterPos && updatedRG[boosterPos]) {
            updatedRG[boosterPos] = { ...updatedRG[boosterPos]!, isRested: true };
          }
          return { ...prev, rearGuards: updatedRG };
        }
      });
    } else {
      setOpponent((prev) => {
        const updatedRG = { ...prev.rearGuards };
        if (attackerPos === 'VANGUARD') {
          return {
            ...prev,
            vanguard: { ...prev.vanguard, isRested: true },
            rearGuards: boosterPos && updatedRG[boosterPos] ? {
              ...updatedRG,
              [boosterPos]: { ...updatedRG[boosterPos]!, isRested: true }
            } : updatedRG
          };
        } else {
          updatedRG[attackerPos] = { ...updatedRG[attackerPos]!, isRested: true };
          if (boosterPos && updatedRG[boosterPos]) {
            updatedRG[boosterPos] = { ...updatedRG[boosterPos]!, isRested: true };
          }
          return { ...prev, rearGuards: updatedRG };
        }
      });
    }

    // Calculate attack power
    const boostPower = boosterUnit ? boosterUnit.card.power + boosterUnit.tempPowerBonus : 0;
    const attackerPower = attackerUnit.card.power + attackerUnit.tempPowerBonus + boostPower;
    const targetPower = targetUnit.card.power + targetUnit.tempPowerBonus;

    addLog(
      attackerSide,
      'ATTACK',
      `${attackerUnit.card.name} (${attackerPower.toLocaleString()}) attacked ${targetUnit.card.name} (${targetPower.toLocaleString()})${boostPower > 0 ? ` with ${boosterUnit!.card.name} boost (+${boostPower.toLocaleString()})` : ''}!`
    );

    // If attacker is Vanguard: Perform Drive Check!
    if (attackerPos === 'VANGUARD') {
      const isTwinDrive = attackerUnit.card.skills.includes('TWIN_DRIVE');
      performDriveCheck(attackerSide, isTwinDrive, 1, attackerPower, targetPower, targetPos);
    } else {
      // Rear-guard attack resolves immediately
      resolveHit(attackerSide, attackerPower, targetPower, targetPos, 1);
    }

    setSelectedAttacker(null);
    setSelectedBooster(null);
  };

  // Drive Check sequence (Single or Twin Drive)
  const performDriveCheck = (
    side: 'PLAYER' | 'OPPONENT',
    isTwinDrive: boolean,
    checkIndex: 1 | 2,
    attackerPower: number,
    targetPower: number,
    targetPos: CirclePosition
  ) => {
    const actor = side === 'PLAYER' ? player : opponent;
    if (actor.deck.length === 0) {
      addLog(side, 'SYSTEM', 'Deck out! No cards remaining to check.');
      return;
    }

    sounds.playDriveCheck();
    const checkedCard = actor.deck[0];
    const trigger = checkedCard.triggerType;

    // Apply trigger
    let updatedAttackerPower = attackerPower;
    let criticalGain = 0;

    if (trigger !== 'NONE') {
      sounds.playTrigger(trigger);
      updatedAttackerPower += 5000;

      if (trigger === 'CRITICAL') {
        criticalGain = 1;
      }

      // Handle trigger effects
      if (side === 'PLAYER') {
        setPlayer((prev) => {
          let updatedDeck = prev.deck.slice(1);
          let updatedHand = [...prev.hand, checkedCard];
          let updatedDamageZone = [...prev.damageZone];

          if (trigger === 'DRAW' && updatedDeck.length > 0) {
            updatedHand.push(updatedDeck[0]);
            updatedDeck = updatedDeck.slice(1);
          }
          if (trigger === 'HEAL' && prev.damageZone.length >= opponent.damageZone.length && updatedDamageZone.length > 0) {
            const healed = updatedDamageZone.pop()!;
            prev.dropZone.push(healed);
          }

          return {
            ...prev,
            deck: updatedDeck,
            hand: updatedHand,
            damageZone: updatedDamageZone,
            vanguard: {
              ...prev.vanguard,
              tempPowerBonus: prev.vanguard.tempPowerBonus + 5000,
              tempCritBonus: prev.vanguard.tempCritBonus + (trigger === 'CRITICAL' ? 1 : 0)
            }
          };
        });
      } else {
        setOpponent((prev) => {
          let updatedDeck = prev.deck.slice(1);
          let updatedHand = [...prev.hand, checkedCard];
          let updatedDamageZone = [...prev.damageZone];

          if (trigger === 'DRAW' && updatedDeck.length > 0) {
            updatedHand.push(updatedDeck[0]);
            updatedDeck = updatedDeck.slice(1);
          }
          if (trigger === 'HEAL' && prev.damageZone.length >= player.damageZone.length && updatedDamageZone.length > 0) {
            const healed = updatedDamageZone.pop()!;
            prev.dropZone.push(healed);
          }

          return {
            ...prev,
            deck: updatedDeck,
            hand: updatedHand,
            damageZone: updatedDamageZone,
            vanguard: {
              ...prev.vanguard,
              tempPowerBonus: prev.vanguard.tempPowerBonus + 5000,
              tempCritBonus: prev.vanguard.tempCritBonus + (trigger === 'CRITICAL' ? 1 : 0)
            }
          };
        });
      }

      addLog(side, 'TRIGGER', `Drive Check #${checkIndex}: Checked ${checkedCard.name} [${trigger} TRIGGER]! +5,000 Power!`);
    } else {
      // Add card to hand without trigger
      if (side === 'PLAYER') {
        setPlayer(prev => ({
          ...prev,
          deck: prev.deck.slice(1),
          hand: [...prev.hand, checkedCard]
        }));
      } else {
        setOpponent(prev => ({
          ...prev,
          deck: prev.deck.slice(1),
          hand: [...prev.hand, checkedCard]
        }));
      }
      addLog(side, 'TRIGGER', `Drive Check #${checkIndex}: Checked ${checkedCard.name} (No Trigger). Card added to hand.`);
    }

    // Show Drive Check modal
    setDriveCheckState({
      card: checkedCard,
      isSecond: checkIndex === 2,
      total: isTwinDrive ? 2 : 1,
      trigger,
      attackerName: actor.vanguard.card.name,
      isOpponent: side === 'OPPONENT'
    });

    // Continue to second drive or hit resolution after confirmation
  };

  // Called when user clicks button on Drive Check modal
  const handleConfirmDriveCheck = () => {
    if (!driveCheckState) return;

    if (driveCheckState.total === 2 && !driveCheckState.isSecond) {
      // Execute 2nd drive check
      setDriveCheckState(null);
      const side = driveCheckState.isOpponent ? 'OPPONENT' : 'PLAYER';
      // Twin drive second check
      performDriveCheck(side, true, 2, 0, 0, 'VANGUARD');
    } else {
      // Finish drive checks, now resolve attack hit!
      setDriveCheckState(null);
      const side = driveCheckState.isOpponent ? 'OPPONENT' : 'PLAYER';
      const attackingPlayer = side === 'PLAYER' ? player : opponent;
      const defendingPlayer = side === 'PLAYER' ? opponent : player;

      const atkPower = attackingPlayer.vanguard.card.power + attackingPlayer.vanguard.tempPowerBonus;
      const defPower = defendingPlayer.vanguard.card.power + defendingPlayer.vanguard.tempPowerBonus;
      const crit = 1 + attackingPlayer.vanguard.tempCritBonus;

      resolveHit(side, atkPower, defPower, 'VANGUARD', crit);
    }
  };

  // Hit Resolution: Check Sentinel, Damage or Retire
  const resolveHit = (
    attackerSide: 'PLAYER' | 'OPPONENT',
    attackPower: number,
    targetPower: number,
    targetPos: CirclePosition,
    crit: number
  ) => {
    const defendingPlayer = attackerSide === 'PLAYER' ? opponent : player;
    const defenderSide = attackerSide === 'PLAYER' ? 'OPPONENT' : 'PLAYER';

    // Hit fails if power is less than target
    if (attackPower < targetPower) {
      addLog(attackerSide, 'ATTACK', `Attack failed! ${attackPower.toLocaleString()} was insufficient to hit ${targetPower.toLocaleString()}.`);
      if (attackerSide === 'PLAYER') {
        setPhase('MAIN_PHASE');
      }
      return;
    }

    // Hit connected!
    if (targetPos === 'VANGUARD') {
      // SENTINEL / PERFECT GUARD CHECK:
      // In Vanguard Zero, if defending player has a Sentinel in hand and would take lethal damage (5 damage -> 6)
      // or 2+ critical damage, the Sentinel automatically intercepts!
      const sentinelInHand = defendingPlayer.hand.find(c => c.isSentinel);
      const isLethalOrDangerous = defendingPlayer.damageZone.length >= 4 || crit > 1;

      if (sentinelInHand && isLethalOrDangerous) {
        sounds.playSentinel();

        // Discard sentinel & another card if available
        if (defenderSide === 'OPPONENT') {
          setOpponent(prev => ({
            ...prev,
            hand: prev.hand.filter(c => c.id !== sentinelInHand.id),
            dropZone: [...prev.dropZone, sentinelInHand]
          }));
        } else {
          setPlayer(prev => ({
            ...prev,
            hand: prev.hand.filter(c => c.id !== sentinelInHand.id),
            dropZone: [...prev.dropZone, sentinelInHand]
          }));
        }

        addLog(defenderSide, 'SENTINEL', `PERFECT GUARD! ${defendingPlayer.name} activated ${sentinelInHand.name}! Attack completely negated!`);
        setSentinelState({
          sentinelCard: sentinelInHand,
          defenderName: defendingPlayer.name,
          attackerName: attackerSide === 'PLAYER' ? player.vanguard.card.name : opponent.vanguard.card.name
        });
        return;
      }

      // Takes damage! Perform Damage Check
      executeDamageCheck(defenderSide, crit);
    } else {
      // Rear-guard is retired!
      sounds.playDamage();
      const retiredUnit = defendingPlayer.rearGuards[targetPos];

      if (defenderSide === 'OPPONENT') {
        setOpponent(prev => {
          const updatedRG = { ...prev.rearGuards };
          delete updatedRG[targetPos];
          return {
            ...prev,
            rearGuards: updatedRG,
            dropZone: retiredUnit ? [...prev.dropZone, retiredUnit.card] : prev.dropZone
          };
        });
      } else {
        setPlayer(prev => {
          const updatedRG = { ...prev.rearGuards };
          delete updatedRG[targetPos];
          return {
            ...prev,
            rearGuards: updatedRG,
            dropZone: retiredUnit ? [...prev.dropZone, retiredUnit.card] : prev.dropZone
          };
        });
      }

      addLog(attackerSide, 'ATTACK', `Hit connected! Opponent's ${retiredUnit?.card.name || 'Rear-guard'} was Retired to the Drop Zone!`);
      if (attackerSide === 'PLAYER') {
        setPhase('MAIN_PHASE');
      }
    }
  };

  // Perform Damage Check for Vanguard hit
  const executeDamageCheck = (defenderSide: 'PLAYER' | 'OPPONENT', damageAmount: number) => {
    const defendingPlayer = defenderSide === 'PLAYER' ? player : opponent;
    const opposingPlayer = defenderSide === 'PLAYER' ? opponent : player;

    if (defendingPlayer.deck.length === 0) {
      // Deck out defeat
      setWinner(defenderSide === 'PLAYER' ? 'OPPONENT' : 'PLAYER');
      return;
    }

    sounds.playDamage();
    const damageCard = defendingPlayer.deck[0];
    const trigger = damageCard.triggerType;
    let healed = false;

    // Check Heal trigger: In Zero, if damage >= opponent's damage, heal 1!
    if (trigger === 'HEAL') {
      if (defendingPlayer.damageZone.length + 1 >= opposingPlayer.damageZone.length) {
        healed = true;
      }
    }

    if (trigger !== 'NONE') {
      sounds.playTrigger(trigger);
      addLog(defenderSide, 'TRIGGER', `DAMAGE TRIGGER! Checked ${damageCard.name} [${trigger} Trigger]! +5,000 Power!`);
    }

    const newDamageList = [...defendingPlayer.damageZone, damageCard];

    if (healed && newDamageList.length > 0) {
      // Heal effect removes 1 damage to drop zone
      const healedCard = newDamageList.pop()!;
      defendingPlayer.dropZone.push(healedCard);
      addLog(defenderSide, 'HEAL', `Heal Trigger activated! Recovered from the brink of defeat!`);
    }

    if (defenderSide === 'PLAYER') {
      setPlayer(prev => ({
        ...prev,
        deck: prev.deck.slice(1),
        damageZone: newDamageList,
        vanguard: {
          ...prev.vanguard,
          tempPowerBonus: prev.vanguard.tempPowerBonus + (trigger !== 'NONE' ? 5000 : 0)
        }
      }));
    } else {
      setOpponent(prev => ({
        ...prev,
        deck: prev.deck.slice(1),
        damageZone: newDamageList,
        vanguard: {
          ...prev.vanguard,
          tempPowerBonus: prev.vanguard.tempPowerBonus + (trigger !== 'NONE' ? 5000 : 0)
        }
      }));
    }

    // Show Damage Check modal
    setDamageCheckState({
      card: damageCard,
      trigger,
      currentDamage: newDamageList.length,
      maxDamage: 6,
      isOpponent: defenderSide === 'OPPONENT',
      healed
    });

    // Check game over
    if (newDamageList.length >= 6) {
      const victor = defenderSide === 'PLAYER' ? 'OPPONENT' : 'PLAYER';
      setWinner(victor);
      sounds.playVictory();
      addLog(victor, 'SYSTEM', `GAME OVER! ${victor === 'PLAYER' ? player.name : opponent.name} reached 6 damage! Victory!`);
    }
  };

  const handleConfirmDamageCheck = () => {
    setDamageCheckState(null);
    if (turnPlayer === 'PLAYER') {
      setPhase('MAIN_PHASE');
    }
  };

  // End Player Turn
  const handleEndTurn = () => {
    // Reset temp power bonuses for player
    setPlayer(prev => ({
      ...prev,
      vanguard: { ...prev.vanguard, tempPowerBonus: 0, tempCritBonus: 0 },
      rearGuards: Object.fromEntries(
        Object.entries(prev.rearGuards).map(([k, u]) => [k, { ...u!, tempPowerBonus: 0, tempCritBonus: 0 }])
      )
    }));

    addLog('PLAYER', 'SYSTEM', `Turn ${turnNumber} ended. Opponent's turn begins.`);
    setTurnPlayer('OPPONENT');
    setIsAiThinking(true);
  };

  // =========================================================================
  // OPPONENT AI TURN AUTOMATION
  // =========================================================================
  useEffect(() => {
    if (!hasStarted || turnPlayer !== 'OPPONENT' || winner) return;

    let timer: NodeJS.Timeout;

    // AI Turn Step 1: Stand & Draw
    timer = setTimeout(() => {
      // Stand units & draw 1
      setOpponent(prev => {
        const updatedRG: Partial<Record<CirclePosition, FieldUnit>> = {};
        Object.entries(prev.rearGuards).forEach(([pos, unit]) => {
          if (unit) updatedRG[pos as CirclePosition] = { ...unit, isRested: false, tempPowerBonus: 0 };
        });

        let newHand = [...prev.hand];
        let newDeck = [...prev.deck];
        if (newDeck.length > 0) {
          newHand.push(newDeck[0]);
          newDeck = newDeck.slice(1);
        }

        return {
          ...prev,
          vanguard: { ...prev.vanguard, isRested: false, tempPowerBonus: 0, tempCritBonus: 0 },
          rearGuards: updatedRG,
          hand: newHand,
          deck: newDeck
        };
      });

      addLog('OPPONENT', 'SYSTEM', `Opponent Stand & Draw Phase completed.`);

      // AI Step 2: Ride Phase
      setTimeout(() => {
        const rideChoice = getAIRideChoice(opponent);
        if (rideChoice) {
          sounds.playRide();

          const currentVg = opponent.vanguard.card;
          const updatedRG = { ...opponent.rearGuards };

          if (currentVg.grade === 0) {
            const pos: CirclePosition = !updatedRG['BACK_CENTER'] ? 'BACK_CENTER' : !updatedRG['BACK_LEFT'] ? 'BACK_LEFT' : 'BACK_RIGHT';
            updatedRG[pos] = {
              id: `${currentVg.id}-ai-fv`,
              card: currentVg,
              isRested: false,
              tempPowerBonus: 0,
              tempCritBonus: 0,
              position: pos
            };
          }

          setOpponent(prev => ({
            ...prev,
            vanguard: {
              id: `${rideChoice.id}-${Date.now()}`,
              card: rideChoice,
              isRested: false,
              tempPowerBonus: 0,
              tempCritBonus: 0,
              position: 'VANGUARD'
            },
            rearGuards: updatedRG,
            hand: prev.hand.filter(c => c.id !== rideChoice.id),
            soul: [...prev.soul, currentVg]
          }));

          addLog('OPPONENT', 'RIDE', `Opponent rode Grade ${rideChoice.grade} ${rideChoice.name}!`);
        }

        // AI Step 3: Main Phase (Calling Rear-guards)
        setTimeout(() => {
          const calls = getAICalls(opponent);
          calls.forEach(({ card, position }) => {
            sounds.playCall();
            setOpponent(prev => ({
              ...prev,
              rearGuards: {
                ...prev.rearGuards,
                [position]: {
                  id: `${card.id}-${Date.now()}`,
                  card,
                  isRested: false,
                  tempPowerBonus: 0,
                  tempCritBonus: 0,
                  position
                }
              },
              hand: prev.hand.filter(c => c.id !== card.id)
            }));
            addLog('OPPONENT', 'CALL', `Opponent called ${card.name} to ${position.replace('_', ' ')}!`);
          });

          // AI Step 4: Battle Phase (Attack)
          setTimeout(() => {
            const attackDec = getNextAIAttack(opponent, player);
            if (attackDec) {
              executeAttack(
                'OPPONENT',
                attackDec.attacker,
                attackDec.booster,
                attackDec.target
              );
            }

            // AI Step 5: End Turn
            setTimeout(() => {
              // Pass turn back to player
              setTurnNumber(prev => prev + 1);
              setTurnPlayer('PLAYER');
              setIsAiThinking(false);

              // Stand player units & draw 1
              setPlayer(prev => {
                const updatedRG: Partial<Record<CirclePosition, FieldUnit>> = {};
                Object.entries(prev.rearGuards).forEach(([pos, unit]) => {
                  if (unit) updatedRG[pos as CirclePosition] = { ...unit, isRested: false, tempPowerBonus: 0 };
                });

                let newHand = [...prev.hand];
                let newDeck = [...prev.deck];
                if (newDeck.length > 0) {
                  newHand.push(newDeck[0]);
                  newDeck = newDeck.slice(1);
                }

                return {
                  ...prev,
                  vanguard: { ...prev.vanguard, isRested: false, tempPowerBonus: 0, tempCritBonus: 0 },
                  rearGuards: updatedRG,
                  hand: newHand,
                  deck: newDeck
                };
              });

              addLog('PLAYER', 'SYSTEM', `Turn ${turnNumber + 1}: Stand & Draw! Your turn!`);
              setPhase('RIDE_PHASE');
            }, 1200);

          }, 1000);

        }, 800);

      }, 600);

    }, 800);

    return () => clearTimeout(timer);
  }, [hasStarted, turnPlayer, winner]);

  // =========================================================================
  // RENDER INTERFACE
  // =========================================================================

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background Stadium Illustration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <img
          src="/src/assets/images/vanguard_arena_bg_1792296022888.jpg"
          alt="Vanguard Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Arena Sub-Header HUD */}
      <div className="relative z-10 w-full px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md flex items-center justify-between text-xs font-mono">
        {/* Left: Match Info & Phase Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
            <span className="text-slate-400">TURN</span>
            <span className="font-bold text-amber-400 text-sm">{turnNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-md font-bold text-xs uppercase tracking-wider ${
                turnPlayer === 'PLAYER'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-rose-600 text-white shadow-sm shadow-rose-500/30'
              }`}
            >
              {turnPlayer === 'PLAYER' ? 'Your Turn' : "Opponent's Turn"}
            </span>

            <span className="text-slate-500">·</span>

            <span className="text-slate-300 font-semibold">
              Phase: <strong className="text-cyan-400">{phase.replace('_', ' ')}</strong>
            </span>
          </div>
        </div>

        {/* Center: Damage Comparison */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Your Damage:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`p-dmg-${i}`}
                  className={`w-3.5 h-3.5 rounded-sm border ${
                    i < player.damageZone.length
                      ? 'bg-red-500 border-red-400 shadow-sm shadow-red-500/50'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
              <span className="font-bold text-red-400 ml-1">{player.damageZone.length}/6</span>
            </div>
          </div>

          <span className="text-slate-600">VS</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Opponent Damage:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`o-dmg-${i}`}
                  className={`w-3.5 h-3.5 rounded-sm border ${
                    i < opponent.damageZone.length
                      ? 'bg-red-500 border-red-400 shadow-sm shadow-red-500/50'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
              <span className="font-bold text-red-400 ml-1">{opponent.damageZone.length}/6</span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleRestartFight}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Main Duel Field Area */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-2 sm:p-4 flex flex-col justify-between">
        {/* Pre-Game "Stand Up The Vanguard" Overlay */}
        {!hasStarted && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border-2 border-cyan-500/50 text-center shadow-2xl space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse">
                <Swords className="w-8 h-8 text-cyan-400" />
              </div>

              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Cardfight!! Vanguard ZERO Revival
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Stand Up, THE Vanguard!
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Duel ready: {player.clan} vs {opponent.clan}. Ready your soul and draw your initial 5 cards!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Vanguard ZERO Combat Rules in Effect:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  • Grade 2 Front-Row Interceptors MUST be attacked first!
                  <br />
                  • Sentinels activate automatically on lethal/dangerous strikes.
                  <br />
                  • Grade 3 units trigger Twin Drive and carry trigger blessings.
                </p>
              </div>

              <button
                onClick={handleStandUpVanguard}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm tracking-wide rounded-xl shadow-xl shadow-cyan-500/30 transition-all cursor-pointer transform hover:scale-102"
              >
                STAND UP, THE VANGUARD!
              </button>
            </div>
          </div>
        )}

        {/* Victory / Defeat Overlay */}
        {winner && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 text-center shadow-2xl space-y-5">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Award className="w-10 h-10 text-amber-400" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {winner === 'PLAYER' ? 'VICTORY ACHIEVED!' : 'DEFEAT'}
                </h2>
                <p className="text-sm text-slate-300 mt-2">
                  {winner === 'PLAYER'
                    ? `Congratulations! You conquered the opponent's defenses in ${turnNumber} turns!`
                    : `The opponent's relentless attacks pierced through your defense.`}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestartFight}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Fight Again
                </button>
                <button
                  onClick={onOpenDeckBuilder}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  Edit Deck
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* OPPONENT BOARD (Top Half) */}
        {/* ================================================================= */}
        <div className="space-y-2">
          {/* Opponent Status Header */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-400">{opponent.name}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{opponent.clan}</span>
              {isAiThinking && (
                <span className="text-amber-400 text-[11px] animate-pulse">Thinking...</span>
              )}
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>Hand: <strong className="text-white">{opponent.hand.length}</strong></span>
              <span>·</span>
              <span>Deck: <strong className="text-white">{opponent.deck.length}</strong></span>
              <span>·</span>
              <span>Drop: <strong className="text-white">{opponent.dropZone.length}</strong></span>
            </div>
          </div>

          {/* Opponent Field Layout: Damage Zone (left) + Circles (center) + Deck/Drop (right) */}
          <div className="flex items-center justify-center gap-3">
            {/* Opponent Damage Zone */}
            <div className="hidden lg:flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800 w-26 flex-shrink-0 shadow-md">
              <span className="text-[10px] font-mono font-bold text-red-400 mb-1">
                DMG ({opponent.damageZone.length}/6)
              </span>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 6 }).map((_, i) => {
                  const card = opponent.damageZone[i];
                  return card ? (
                    <div key={i} onClick={() => onSelectCardInspect(card)} className="cursor-pointer hover:scale-105 transition-transform" title={card.name}>
                      <CardView card={card} isSmall={true} />
                    </div>
                  ) : (
                    <div key={i} className="w-10 h-14 rounded border border-dashed border-slate-800 bg-slate-950/40 flex items-center justify-center text-[9px] text-slate-700 font-mono">
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Opponent Circles Grid */}
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-inner flex flex-col gap-2">
              {/* Opponent Back Row (Back Left, Back Center, Back Right) */}
              <div className="flex justify-center gap-4 sm:gap-8">
                <FieldCircle
                  position="BACK_LEFT"
                  unit={opponent.rearGuards['BACK_LEFT']}
                  isOpponent={true}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="BACK_CENTER"
                  unit={opponent.rearGuards['BACK_CENTER']}
                  isOpponent={true}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="BACK_RIGHT"
                  unit={opponent.rearGuards['BACK_RIGHT']}
                  isOpponent={true}
                  onCardInspect={onSelectCardInspect}
                />
              </div>

              {/* Opponent Front Row (Front Left, Vanguard, Front Right) */}
              <div className="flex justify-center gap-4 sm:gap-8">
                <FieldCircle
                  position="FRONT_LEFT"
                  unit={opponent.rearGuards['FRONT_LEFT']}
                  isOpponent={true}
                  isTargetable={selectedAttacker !== null}
                  onClick={() => selectedAttacker && handleSelectTarget('FRONT_LEFT')}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="VANGUARD"
                  unit={opponent.vanguard}
                  isVanguard={true}
                  isOpponent={true}
                  isTargetable={selectedAttacker !== null && opponentInterceptors.length === 0}
                  isBlockedByIntercept={selectedAttacker !== null && opponentInterceptors.length > 0}
                  onClick={() => selectedAttacker && handleSelectTarget('VANGUARD')}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="FRONT_RIGHT"
                  unit={opponent.rearGuards['FRONT_RIGHT']}
                  isOpponent={true}
                  isTargetable={selectedAttacker !== null}
                  onClick={() => selectedAttacker && handleSelectTarget('FRONT_RIGHT')}
                  onCardInspect={onSelectCardInspect}
                />
              </div>
            </div>

            {/* Opponent Deck & Drop Zone */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 w-26 flex-shrink-0 shadow-md">
              <div className="text-center">
                <span className="text-[9px] font-mono text-slate-400 block mb-0.5">DECK ({opponent.deck.length})</span>
                <div className="w-14 h-20 relative">
                  <CardBack className="w-14 h-20 rounded-md" />
                </div>
              </div>
              <div className="text-center pt-1 border-t border-slate-800 w-full font-mono text-[9px] text-slate-400">
                DROP: <strong className="text-white">{opponent.dropZone.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Center Arena Battle Divider Line with Action Bar */}
        <div className="my-2 py-1.5 px-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          {/* Contextual Action Instructions */}
          <div className="flex items-center gap-2">
            {turnPlayer === 'PLAYER' && (
              <>
                {phase === 'RIDE_PHASE' && (
                  <span className="text-cyan-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Select a card in your hand with Grade {player.vanguard.card.grade + 1} to Ride!
                  </span>
                )}
                {phase === 'MAIN_PHASE' && (
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Select a card from hand to Call to Rear-guard, or select a unit to Attack!
                  </span>
                )}
                {phase === 'BATTLE_TARGET_SELECT' && (
                  <span className="text-rose-300 font-semibold flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5" />
                    {opponentInterceptors.length > 0
                      ? 'Opponent has Interceptors! Select Front Left or Front Right to attack!'
                      : 'Interceptors clear! Click the opponent Vanguard to attack!'}
                  </span>
                )}
              </>
            )}
            {turnPlayer === 'OPPONENT' && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Opponent is executing their battle phase...
              </span>
            )}
          </div>

          {/* Player Phase Transition Buttons */}
          {turnPlayer === 'PLAYER' && (
            <div className="flex items-center gap-2">
              {phase === 'RIDE_PHASE' && (
                <button
                  onClick={() => setPhase('MAIN_PHASE')}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold transition-all cursor-pointer"
                >
                  Skip Ride
                </button>
              )}

              {phase === 'BATTLE_TARGET_SELECT' && (
                <button
                  onClick={() => {
                    setSelectedAttacker(null);
                    setSelectedBooster(null);
                    setPhase('MAIN_PHASE');
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  Cancel Attack
                </button>
              )}

              {phase === 'MAIN_PHASE' && (
                <button
                  onClick={handleEndTurn}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                >
                  <span>End Turn</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* PLAYER BOARD (Bottom Half) */}
        {/* ================================================================= */}
        <div className="space-y-2">
          {/* Player Field Layout: Damage Zone (left) + Circles (center) + Deck/Drop (right) */}
          <div className="flex items-center justify-center gap-3">
            {/* Player Damage Zone */}
            <div className="hidden lg:flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800 w-26 flex-shrink-0 shadow-md">
              <span className="text-[10px] font-mono font-bold text-red-400 mb-1">
                DMG ({player.damageZone.length}/6)
              </span>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 6 }).map((_, i) => {
                  const card = player.damageZone[i];
                  const isFaceDown = i < player.faceDownDamageCount;
                  return card ? (
                    <div
                      key={i}
                      onClick={() => !isFaceDown && onSelectCardInspect(card)}
                      className={`cursor-pointer hover:scale-105 transition-transform ${isFaceDown ? 'opacity-70' : ''}`}
                      title={isFaceDown ? 'Face-Down (Counter Blasted)' : card.name}
                    >
                      {isFaceDown ? (
                        <div className="w-10 h-14 rounded overflow-hidden border border-amber-600/60">
                          <CardBack className="w-10 h-14" isSmall={true} />
                        </div>
                      ) : (
                        <CardView card={card} isSmall={true} />
                      )}
                    </div>
                  ) : (
                    <div key={i} className="w-10 h-14 rounded border border-dashed border-slate-800 bg-slate-950/40 flex items-center justify-center text-[9px] text-slate-700 font-mono">
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Player Circles Grid */}
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-inner flex flex-col gap-2">
              {/* Player Front Row (Front Left, Vanguard, Front Right) */}
              <div className="flex justify-center gap-4 sm:gap-8">
                <FieldCircle
                  position="FRONT_LEFT"
                  unit={player.rearGuards['FRONT_LEFT']}
                  isSelected={selectedAttacker === 'FRONT_LEFT'}
                  isCallTarget={selectedHandIndex !== null && !player.rearGuards['FRONT_LEFT']}
                  onClick={() => {
                    if (selectedHandIndex !== null) handlePlayerCall('FRONT_LEFT');
                    else handleSelectAttacker('FRONT_LEFT');
                  }}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="VANGUARD"
                  unit={player.vanguard}
                  isVanguard={true}
                  isSelected={selectedAttacker === 'VANGUARD'}
                  onClick={() => {
                    if (selectedHandIndex !== null && phase === 'RIDE_PHASE') {
                      handlePlayerRide(selectedHandIndex);
                    } else {
                      handleSelectAttacker('VANGUARD');
                    }
                  }}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="FRONT_RIGHT"
                  unit={player.rearGuards['FRONT_RIGHT']}
                  isSelected={selectedAttacker === 'FRONT_RIGHT'}
                  isCallTarget={selectedHandIndex !== null && !player.rearGuards['FRONT_RIGHT']}
                  onClick={() => {
                    if (selectedHandIndex !== null) handlePlayerCall('FRONT_RIGHT');
                    else handleSelectAttacker('FRONT_RIGHT');
                  }}
                  onCardInspect={onSelectCardInspect}
                />
              </div>

              {/* Player Back Row (Back Left, Back Center, Back Right) */}
              <div className="flex justify-center gap-4 sm:gap-8">
                <FieldCircle
                  position="BACK_LEFT"
                  unit={player.rearGuards['BACK_LEFT']}
                  isBoosterSelected={selectedBooster === 'BACK_LEFT'}
                  isCallTarget={selectedHandIndex !== null && !player.rearGuards['BACK_LEFT']}
                  onClick={() => {
                    if (selectedHandIndex !== null) handlePlayerCall('BACK_LEFT');
                    else if (selectedAttacker === 'FRONT_LEFT') {
                      setSelectedBooster(selectedBooster === 'BACK_LEFT' ? null : 'BACK_LEFT');
                    }
                  }}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="BACK_CENTER"
                  unit={player.rearGuards['BACK_CENTER']}
                  isBoosterSelected={selectedBooster === 'BACK_CENTER'}
                  isCallTarget={selectedHandIndex !== null && !player.rearGuards['BACK_CENTER']}
                  onClick={() => {
                    if (selectedHandIndex !== null) handlePlayerCall('BACK_CENTER');
                    else if (selectedAttacker === 'VANGUARD') {
                      setSelectedBooster(selectedBooster === 'BACK_CENTER' ? null : 'BACK_CENTER');
                    }
                  }}
                  onCardInspect={onSelectCardInspect}
                />
                <FieldCircle
                  position="BACK_RIGHT"
                  unit={player.rearGuards['BACK_RIGHT']}
                  isBoosterSelected={selectedBooster === 'BACK_RIGHT'}
                  isCallTarget={selectedHandIndex !== null && !player.rearGuards['BACK_RIGHT']}
                  onClick={() => {
                    if (selectedHandIndex !== null) handlePlayerCall('BACK_RIGHT');
                    else if (selectedAttacker === 'FRONT_RIGHT') {
                      setSelectedBooster(selectedBooster === 'BACK_RIGHT' ? null : 'BACK_RIGHT');
                    }
                  }}
                  onCardInspect={onSelectCardInspect}
                />
              </div>
            </div>

            {/* Player Deck & Drop Zone */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 w-26 flex-shrink-0 shadow-md">
              <div className="text-center">
                <span className="text-[9px] font-mono text-slate-400 block mb-0.5">DECK ({player.deck.length})</span>
                <div className="w-14 h-20 relative">
                  <CardBack className="w-14 h-20 rounded-md" />
                </div>
              </div>
              <div className="text-center pt-1 border-t border-slate-800 w-full font-mono text-[9px] text-slate-400">
                DROP: <strong className="text-white">{player.dropZone.length}</strong>
              </div>
            </div>
          </div>

          {/* Player Hand Fan and Deck Meters */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-cyan-400">Your Hand ({player.hand.length} cards)</span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-400">
                  {selectedHandIndex !== null
                    ? `Selected: ${player.hand[selectedHandIndex]?.name} (Click circle to Call or Ride)`
                    : 'Click a card to select for Ride or Call'}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>Soul: <strong className="text-amber-400">{player.soul.length}</strong></span>
                <span>·</span>
                <span>Deck: <strong className="text-white">{player.deck.length}</strong></span>
                <span>·</span>
                <span>Drop: <strong className="text-white">{player.dropZone.length}</strong></span>
              </div>
            </div>

            {/* Hand Cards */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
              {player.hand.map((card, idx) => {
                const isRideCandidate =
                  phase === 'RIDE_PHASE' &&
                  (card.grade === player.vanguard.card.grade + 1 || card.grade === player.vanguard.card.grade);

                return (
                  <div key={`${card.id}-${idx}`} className="flex-shrink-0 relative">
                    <CardView
                      card={card}
                      isSelected={selectedHandIndex === idx}
                      isPlayable={isRideCandidate || phase === 'MAIN_PHASE'}
                      onClick={() => {
                        if (selectedHandIndex === idx) {
                          setSelectedHandIndex(null);
                        } else {
                          setSelectedHandIndex(idx);
                        }
                      }}
                      showTrigger={true}
                    />

                    {/* Ride shortcut badge */}
                    {isRideCandidate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayerRide(idx);
                        }}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer z-30"
                      >
                        RIDE!
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Combat Log Toggle Bar */}
        <div className="mt-3">
          <CombatLog
            logs={logs}
            isOpen={isLogOpen}
            onToggle={() => setIsLogOpen(!isLogOpen)}
          />
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODALS */}
      {/* ================================================================= */}

      {/* Drive Check Reveal Modal */}
      {driveCheckState && (
        <DriveCheckModal
          card={driveCheckState.card}
          isSecondDrive={driveCheckState.isSecond}
          totalDrives={driveCheckState.total}
          triggerType={driveCheckState.trigger}
          attackerName={driveCheckState.attackerName}
          isOpponent={driveCheckState.isOpponent}
          onConfirm={handleConfirmDriveCheck}
        />
      )}

      {/* Damage Check Modal */}
      {damageCheckState && (
        <DamageCheckModal
          card={damageCheckState.card}
          triggerType={damageCheckState.trigger}
          currentDamage={damageCheckState.currentDamage}
          maxDamage={damageCheckState.maxDamage}
          isOpponent={damageCheckState.isOpponent}
          healed={damageCheckState.healed}
          onConfirm={handleConfirmDamageCheck}
        />
      )}

      {/* Sentinel Modal */}
      {sentinelState && (
        <SentinelActivationModal
          sentinelCard={sentinelState.sentinelCard}
          defenderName={sentinelState.defenderName}
          attackerName={sentinelState.attackerName}
          onConfirm={() => {
            setSentinelState(null);
            if (turnPlayer === 'PLAYER') {
              setPhase('MAIN_PHASE');
            }
          }}
        />
      )}
    </div>
  );
};
