import { Effect } from './effect';
import { AbstractAttackEffect } from './attack-effects';
import { AttackEffect } from './game-effects';
import { Attack } from '../card/pokemon-types';
import { Card } from '../card/card';
import { MarkerConstants } from '../markers/marker-constants';
import { PokemonCardList, PreventDamageFilter } from '../state/pokemon-card-list';

/**
 * Base class for effects that are caused by attacks
 * These can be prevented by abilities like Skeledirge's "Unaware"
 */
export abstract class EffectOfAttackEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = 'EFFECT_OF_ATTACK_EFFECT';
  public preventDefault = false;
  public markerSource!: Card;

  constructor(base: AttackEffect) {
    super(base);
  }

  /**
   * Apply the effect to the target
   * Override this in subclasses
   */
  abstract applyEffect(): void;
}

/**
 * Effect that prevents the defending Pokemon from retreating during the opponent's next turn.
 */
export class PreventRetreatEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_RETREAT_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.cannotRetreatNextTurn = true;
  }
}

/**
 * Optional filters for {@link PreventDamageEffect}.
 * An empty object prevents all attack damage during the opponent's next turn.
 */
export type PreventDamageOptions = PreventDamageFilter;

export function shouldPreventAttackDamage(
  target: PokemonCardList,
  source: PokemonCardList,
): boolean {
  const filter = target.preventDamageNextTurn;
  if (!filter) {
    return false;
  }

  const sourceCard = source.getPokemonCard();
  if (!sourceCard) {
    return false;
  }

  if (filter.sourceStage !== undefined && sourceCard.stage !== filter.sourceStage) {
    return false;
  }

  if (filter.sourceTags !== undefined
    && !filter.sourceTags.some(tag => sourceCard.tags.includes(tag))) {
    return false;
  }

  return true;
}

/**
 * During the opponent's next turn, prevents attack damage to this Pokémon.
 * Use {@link PreventDamageOptions} to restrict which attackers are blocked.
 */
export class PreventDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_DAMAGE_EFFECT';

  constructor(base: AttackEffect, public readonly options: PreventDamageOptions = {}) {
    super(base);
    // Self-protection applies to the attacking Pokémon, not the defender.
    // Using the defender as target causes tools like Mist Energy to incorrectly block it.
    this.target = base.source;
  }

  applyEffect(): void {
    const filter: PreventDamageFilter = {};
    if (this.options.sourceStage !== undefined) {
      filter.sourceStage = this.options.sourceStage;
    }
    if (this.options.sourceTags !== undefined) {
      filter.sourceTags = this.options.sourceTags;
    }
    this.player.active.preventDamageNextTurnPending = filter;
  }
}

/**
 * During the opponent's next turn, the Defending Pokémon can't use attacks.
 */
export class PreventAttackEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_ATTACK_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.cannotAttackNextTurn = true;
  }
}

/**
 * Effect that prevents the defending Pokemon from using a specific attack during the opponent's next turn.
 */
export class OpponentPokemonCannotUseAttackEffect extends EffectOfAttackEffect {
  readonly type: string = 'OPPONENT_POKEMON_CANNOT_USE_ATTACK_EFFECT';

  constructor(base: AttackEffect, public blockedAttack: Attack) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.blockedAttackNameNextTurn = this.blockedAttack.name;
  }
}

/**
 * Effect that adds a damage reduction marker
 */
export class ReduceDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'REDUCE_DAMAGE_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.marker.addMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this.markerSource, 'attack', 'pokemon');
  }
}

/**
 * Helper functions for creating common effect-of-attack effects
 */
export function preventRetreatEffect(attackEffect: AttackEffect, source: Card): PreventRetreatEffect {
  const effect = new PreventRetreatEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function preventDamageEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: PreventDamageOptions = {},
): PreventDamageEffect {
  const effect = new PreventDamageEffect(attackEffect, options);
  effect.markerSource = source;
  return effect;
}

export function preventAttackEffect(attackEffect: AttackEffect, source: Card): PreventAttackEffect {
  const effect = new PreventAttackEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function opponentPokemonCannotUseAttackEffect(
  attackEffect: AttackEffect,
  source: Card,
  blockedAttack: Attack,
): OpponentPokemonCannotUseAttackEffect {
  const effect = new OpponentPokemonCannotUseAttackEffect(attackEffect, blockedAttack);
  effect.markerSource = source;
  return effect;
}

export function reduceDamageEffect(attackEffect: AttackEffect, source: Card): ReduceDamageEffect {
  const effect = new ReduceDamageEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

/**
 * Effect that causes the defending Pokemon to take more damage from attacks
 * during the attacking player's next turn (after applying Weakness and Resistance).
 */
export class DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_ATTACKER_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public damageBonus: number) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.defendingPokemonExtraDamageNextTurn = this.damageBonus;
    this.opponent.active.defendingPokemonExtraDamageAttackerId = this.player.id;
    this.opponent.active.defendingPokemonExtraDamagePending = true;
  }
}

export function defendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  damageBonus: number,
): DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect {
  const effect = new DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect(attackEffect, damageBonus);
  effect.markerSource = source;
  return effect;
}
