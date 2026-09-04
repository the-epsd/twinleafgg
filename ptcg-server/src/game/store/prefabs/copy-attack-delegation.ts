import { GameLog } from '../../game-message';
import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';
import { AfterDamageEffect, DealDamageEffect, PutCountersEffect, PutDamageEffect } from '../effects/attack-effects';
import { Effect } from '../effects/effect';
import { AttackEffect, KnockOutEffect } from '../effects/game-effects';
import {
  AfterAttackEffect,
  BeforeDoingDamageEffect,
  BeginTurnEffect,
  BetweenTurnsEffect,
  EndTurnEffect,
} from '../effects/game-phase-effects';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { PlayerType } from '../actions/play-card-action';

export function cloneAttack(attack: Attack): Attack {
  return { ...attack, cost: [...(attack.cost || [])] };
}

export function cloneAttacks(attacks: Attack[]): Attack[] {
  return attacks.map(cloneAttack);
}

export function findAttackIndex(source: PokemonCard, attack: Attack): number {
  const byRef = source.attacks.indexOf(attack);
  if (byRef >= 0) {
    return byRef;
  }
  return source.attacks.findIndex(a => a.name === attack.name);
}

export function withTemporaryDelegatedAttacks<T>(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  fn: (clonedAttacks: Attack[]) => T,
  clonedAttacks?: Attack[],
): T {
  const saved = copycatCard.attacks;
  const cloned = clonedAttacks ?? cloneAttacks(sourceCard.attacks || []);
  copycatCard.attacks = cloned;
  try {
    return fn(cloned);
  } finally {
    copycatCard.attacks = saved;
  }
}

function withSourceMarkerConstants<T>(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  fn: () => T,
): T {
  const saved: { key: string; hadOwn: boolean; value: unknown }[] = [];

  for (const key of Object.keys(sourceCard)) {
    if (!/MARKER/i.test(key)) {
      continue;
    }
    const value = (sourceCard as any)[key];
    if (typeof value !== 'string') {
      continue;
    }
    saved.push({
      key,
      hadOwn: Object.prototype.hasOwnProperty.call(copycatCard, key),
      value: (copycatCard as any)[key],
    });
    (copycatCard as any)[key] = value;
  }

  try {
    return fn();
  } finally {
    for (const entry of saved) {
      if (entry.hadOwn) {
        (copycatCard as any)[entry.key] = entry.value;
      } else {
        delete (copycatCard as any)[entry.key];
      }
    }
  }
}

function delegateToSource(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  clonedAttacks: Attack[],
  store: StoreLike,
  state: State,
  effect: Effect,
): State {
  return withTemporaryDelegatedAttacks(
    copycatCard,
    sourceCard,
    () => withSourceMarkerConstants(copycatCard, sourceCard, () =>
      sourceCard.reduceEffect.call(copycatCard, store, state, effect)
    ),
    clonedAttacks,
  );
}

/**
 * Sticky session: keep source reduceEffect bound to the copycat through damage,
 * KO prizes, and multi-turn marker cleanup (attack-only; not Abilities).
 */
interface CopyAttackSession {
  copycatCard: PokemonCard;
  sourceCard: PokemonCard;
  clonedAttacks: Attack[];
  playerId: number;
  /** Safety cap across either player's EndTurns (turn-skip + Harden linger). */
  endTurnsRemaining: number;
}

const copyAttackSessions: CopyAttackSession[] = [];

const DEFAULT_END_TURN_BUDGET = 4;

function isCopycatInPlay(state: State, copycatCard: PokemonCard): boolean {
  for (const player of state.players) {
    let found = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
      if (card === copycatCard) {
        found = true;
      }
    });
    if (found) {
      return true;
    }
  }
  return false;
}

function isClonedAttack(session: CopyAttackSession, attack: Attack | undefined): boolean {
  if (attack === undefined) {
    return false;
  }
  return session.clonedAttacks.includes(attack);
}

function targetIncludesCopycat(effect: { target?: { cards?: unknown[] } }, copycatCard: PokemonCard): boolean {
  return !!effect.target?.cards?.includes(copycatCard);
}

/**
 * Attack-only filters so Ability DealDamage boosts do not bleed onto the copycat.
 */
export function shouldDelegateCopyAttackSession(session: CopyAttackSession, state: State, effect: Effect): boolean {
  if (effect instanceof EndTurnEffect
    || effect instanceof BetweenTurnsEffect
    || effect instanceof BeginTurnEffect) {
    return true;
  }

  if (effect instanceof KnockOutEffect) {
    if (state.phase !== GamePhase.ATTACK) {
      return false;
    }
    const attacker = state.players[state.activePlayer];
    return attacker !== undefined && attacker.id === session.playerId;
  }

  if (effect instanceof DealDamageEffect) {
    // Harden-style only — do not match by cloned attack (Ability DealDamage bleed).
    return targetIncludesCopycat(effect, session.copycatCard);
  }

  if (effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) {
    if (targetIncludesCopycat(effect, session.copycatCard)) {
      return true;
    }
    return isClonedAttack(session, effect.attack);
  }

  if (effect instanceof AfterDamageEffect) {
    return isClonedAttack(session, effect.attack);
  }

  if (effect instanceof AttackEffect
    || effect instanceof BeforeDoingDamageEffect
    || effect instanceof AfterAttackEffect) {
    return isClonedAttack(session, effect.attack);
  }

  return false;
}

export function openCopyAttackSession(
  state: State,
  player: Player,
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  clonedAttacks: Attack[],
  selectedClonedAttack: Attack,
): void {
  for (let i = copyAttackSessions.length - 1; i >= 0; i--) {
    if (copyAttackSessions[i].copycatCard === copycatCard) {
      copyAttackSessions.splice(i, 1);
    }
  }

  copyAttackSessions.push({
    copycatCard,
    sourceCard,
    clonedAttacks,
    playerId: player.id,
    endTurnsRemaining: DEFAULT_END_TURN_BUDGET,
  });

  if (!state.playerLastAttack) {
    state.playerLastAttack = {};
  }
  state.playerLastAttack[player.id] = {
    attack: selectedClonedAttack,
    sourceCard: copycatCard,
  };
}

/**
 * After global fan-out: run source handlers as `.call(copycat)` when the effect
 * is part of the copied attack lifecycle.
 */
export function resolveCopyAttackSessions(
  store: StoreLike,
  state: State,
  effect: Effect,
): State {
  for (let i = copyAttackSessions.length - 1; i >= 0; i--) {
    const session = copyAttackSessions[i];

    if (!isCopycatInPlay(state, session.copycatCard)) {
      copyAttackSessions.splice(i, 1);
      continue;
    }

    if (!shouldDelegateCopyAttackSession(session, state, effect)) {
      continue;
    }

    state = delegateToSource(
      session.copycatCard,
      session.sourceCard,
      session.clonedAttacks,
      store,
      state,
      effect,
    );

    if (effect instanceof EndTurnEffect) {
      session.endTurnsRemaining -= 1;
      if (session.endTurnsRemaining <= 0) {
        copyAttackSessions.splice(i, 1);
      }
    }
  }

  return state;
}

/** @deprecated Use resolveCopyAttackSessions via Store.reduceEffect. Kept for tests. */
export function resolveCopyTurnDelegations(
  store: StoreLike,
  state: State,
  effect: EndTurnEffect,
): State {
  return resolveCopyAttackSessions(store, state, effect);
}

/** Test helper — clear sessions between specs. */
export function clearCopyTurnDelegationsForTests(): void {
  copyAttackSessions.length = 0;
}

export function clearCopyAttackSessionsForTests(): void {
  copyAttackSessions.length = 0;
}

export interface DelegatedCopiedAttackContext {
  store: StoreLike;
  state: State;
  player: Player;
  opponent: Player;
  copycatCard: PokemonCard;
  sourceCard: PokemonCard;
  selectedAttack: Attack;
  /** AttackEffect.source; defaults to player.active when omitted. */
  sourceSlot?: AttackEffect['source'];
  /** Skip LOG_PLAYER_COPIES_ATTACK when the caller already logged. */
  skipLog?: boolean;
  /** Skip AfterAttackEffect (e.g. when useAttack will emit it). */
  skipAfterAttack?: boolean;
}

/**
 * Execute a copied attack via sticky session + store.reduceEffect fan-out.
 * Cloned attacks are installed only around `.call(copycat)` so the copycat's
 * own WAS_ATTACK_USED / AFTER_ATTACK handlers do not match by index.
 */
export function runDelegatedCopiedAttack(ctx: DelegatedCopiedAttackContext): State {
  const {
    store,
    state: initialState,
    player,
    opponent,
    copycatCard,
    sourceCard,
    selectedAttack,
    sourceSlot,
    skipLog = false,
    skipAfterAttack = false,
  } = ctx;

  const attackIndex = findAttackIndex(sourceCard, selectedAttack);
  if (attackIndex < 0) {
    return initialState;
  }

  let state = initialState;

  if (!skipLog) {
    store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
      name: player.name,
      attack: selectedAttack.name,
    });
  }

  const clonedAttacks = cloneAttacks(sourceCard.attacks || []);
  const clonedAttack = clonedAttacks[attackIndex];
  openCopyAttackSession(state, player, copycatCard, sourceCard, clonedAttacks, clonedAttack);

  const attackEffect = new AttackEffect(player, opponent, clonedAttack);
  attackEffect.source = sourceSlot ?? player.active;

  // Fan-out while copycat still has its printed attacks (no index leak).
  // Session hook after propagateEffect runs source as .call(copycat).
  state = store.reduceEffect(state, attackEffect);

  const beforeDoingDamageEffect = new BeforeDoingDamageEffect(attackEffect);
  state = store.reduceEffect(state, beforeDoingDamageEffect);

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  if (!skipAfterAttack) {
    const afterAttackEffect = new AfterAttackEffect(player, opponent, clonedAttack);
    state = store.reduceEffect(state, afterAttackEffect);
  }

  return state;
}

/**
 * Generator variant that yields while waiting on prompts opened during delegation.
 */
export function* runDelegatedCopiedAttackGenerator(
  next: Function,
  ctx: DelegatedCopiedAttackContext,
): IterableIterator<State> {
  const {
    store,
    state: initialState,
    player,
    opponent,
    copycatCard,
    sourceCard,
    selectedAttack,
    sourceSlot,
    skipLog = false,
    skipAfterAttack = false,
  } = ctx;

  const attackIndex = findAttackIndex(sourceCard, selectedAttack);
  if (attackIndex < 0) {
    return initialState;
  }

  let state = initialState;

  if (!skipLog) {
    store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
      name: player.name,
      attack: selectedAttack.name,
    });
  }

  const clonedAttacks = cloneAttacks(sourceCard.attacks || []);
  const clonedAttack = clonedAttacks[attackIndex];
  openCopyAttackSession(state, player, copycatCard, sourceCard, clonedAttacks, clonedAttack);

  const attackEffect = new AttackEffect(player, opponent, clonedAttack);
  attackEffect.source = sourceSlot ?? player.active;

  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  const beforeDoingDamageEffect = new BeforeDoingDamageEffect(attackEffect);
  state = store.reduceEffect(state, beforeDoingDamageEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
  }

  if (!skipAfterAttack) {
    const afterAttackEffect = new AfterAttackEffect(player, opponent, clonedAttack);
    state = store.reduceEffect(state, afterAttackEffect);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
  }

  return state;
}
