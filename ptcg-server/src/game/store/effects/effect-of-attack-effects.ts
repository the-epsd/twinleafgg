import { Effect } from './effect';
import {
  AbstractAttackEffect,
  ApplyWeaknessEffect,
  DealDamageEffect,
  PutDamageEffect,
} from './attack-effects';
import { AttackEffect } from './game-effects';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { Attack, PowerType } from '../card/pokemon-types';
import { Card } from '../card/card';
import { CardType, Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList, PreventDamageFilter } from '../state/pokemon-card-list';

function sourceMatchesPreventFilter(
  sourceCard: PokemonCard,
  filter: PreventDamageFilter,
): boolean {
  if (filter.sourceStage !== undefined && sourceCard.stage !== filter.sourceStage) {
    return false;
  }

  if (filter.sourceIsEvolution === true && sourceCard.stage === Stage.BASIC) {
    return false;
  }

  if (filter.sourceTags !== undefined
    && !filter.sourceTags.some(tag => sourceCard.tags.includes(tag))) {
    return false;
  }

  if (filter.sourceCardTypes !== undefined
    && !filter.sourceCardTypes.includes(sourceCard.cardType)) {
    return false;
  }

  if (filter.sourceHasAbility === true
    && !sourceCard.powers.some(p => p.powerType === PowerType.ABILITY)) {
    return false;
  }

  return true;
}

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

  return sourceMatchesPreventFilter(sourceCard, filter);
}

/** Whether {@link PokemonCardList.damageReductionNextTurn} should apply for this source. */
export function shouldApplyDamageReduction(
  target: PokemonCardList,
  source: PokemonCardList,
): boolean {
  if (target.damageReductionNextTurn === 0) {
    return false;
  }

  const filter = target.damageReductionNextTurnFilter;
  if (!filter) {
    return true;
  }

  const sourceCard = source.getPokemonCard();
  if (!sourceCard) {
    return false;
  }

  return sourceMatchesPreventFilter(sourceCard, filter);
}

/**
 * Returns true when an attack effect (not damage) should be blocked on the target
 * because it has {@link PokemonCardList.preventEffectsOfAttacksNextTurn} active.
 * Mirrors Mist Energy: damage is not an effect.
 */
export function shouldPreventAttackEffects(state: State, effect: Effect): boolean {
  if (!(effect instanceof AbstractAttackEffect)) {
    return false;
  }

  const filter = effect.target.preventEffectsOfAttacksNextTurn;
  if (!filter) {
    return false;
  }

  const targetOwner = StateUtils.findOwner(state, effect.target);
  const sourceOwner = StateUtils.findOwner(state, effect.source);
  if (sourceOwner !== StateUtils.getOpponent(state, targetOwner)) {
    return false;
  }

  const sourceCard = effect.source.getPokemonCard();
  if (!sourceCard) {
    return false;
  }

  if (
    effect instanceof ApplyWeaknessEffect ||
    effect instanceof PutDamageEffect ||
    effect instanceof DealDamageEffect
  ) {
    return false;
  }

  return sourceMatchesPreventFilter(sourceCard, filter);
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
    if (this.options.sourceCardTypes !== undefined) {
      filter.sourceCardTypes = this.options.sourceCardTypes;
    }
    if (this.options.sourceHasAbility !== undefined) {
      filter.sourceHasAbility = this.options.sourceHasAbility;
    }
    this.player.active.preventDamageNextTurnPending = filter;
  }
}

/**
 * During the opponent's next turn, prevents effects of attacks done to this Pokémon.
 * Damage is not an effect and is handled separately (e.g. {@link PreventDamageEffect}).
 * Use {@link PreventDamageOptions} to restrict which attackers are blocked.
 */
export class PreventEffectsOfAttacksEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_EFFECTS_OF_ATTACKS_EFFECT';

  constructor(base: AttackEffect, public readonly options: PreventDamageOptions = {}) {
    super(base);
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
    if (this.options.sourceCardTypes !== undefined) {
      filter.sourceCardTypes = this.options.sourceCardTypes;
    }
    if (this.options.sourceHasAbility !== undefined) {
      filter.sourceHasAbility = this.options.sourceHasAbility;
    }
    this.player.active.preventEffectsOfAttacksNextTurnPending = filter;
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
 * During the opponent's next turn, if the Defending Pokémon tries to attack,
 * they flip coin(s). If any is tails, that attack does nothing (Smokescreen / Sand-Attack).
 */
export class CoinFlipCancelAttackEffect extends EffectOfAttackEffect {
  readonly type: string = 'COIN_FLIP_CANCEL_ATTACK_EFFECT';

  constructor(base: AttackEffect, public coinFlips: number = 1) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.coinFlipCancelAttackNextTurn = Math.max(1, this.coinFlips);
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
 * During the opponent's next turn, the Defending Pokémon's attacks do
 * `reduction` less damage (before applying Weakness and Resistance).
 * Effect lives on the Defending Pokémon — switching/benching clears it.
 */
export class ReduceDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'REDUCE_DAMAGE_EFFECT';

  constructor(base: AttackEffect, public reduction: number) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.attackDamageReductionNextTurn = Math.max(0, this.reduction);
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

export function preventEffectsOfAttacksEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: PreventDamageOptions = {},
): PreventEffectsOfAttacksEffect {
  const effect = new PreventEffectsOfAttacksEffect(attackEffect, options);
  effect.markerSource = source;
  return effect;
}

export function preventAttackEffect(attackEffect: AttackEffect, source: Card): PreventAttackEffect {
  const effect = new PreventAttackEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function coinFlipCancelAttackEffect(
  attackEffect: AttackEffect,
  source: Card,
  coinFlips: number = 1,
): CoinFlipCancelAttackEffect {
  const effect = new CoinFlipCancelAttackEffect(attackEffect, coinFlips);
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

export function reduceDamageEffect(
  attackEffect: AttackEffect,
  source: Card,
  reduction: number,
): ReduceDamageEffect {
  const effect = new ReduceDamageEffect(attackEffect, reduction);
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
    const target = this.opponent.active;
    const bonusAlreadyActive = target.defendingPokemonExtraDamageNextTurn > 0
      && !target.defendingPokemonExtraDamagePending
      && target.defendingPokemonExtraDamageAttackerId === this.player.id;

    target.defendingPokemonExtraDamageNextTurn = this.damageBonus;
    target.defendingPokemonExtraDamageAttackerId = this.player.id;

    if (bonusAlreadyActive) {
      // Attack effects run before damage. Keep the bonus active for this attack,
      // then re-arm pending afterward so the next trap cycle can begin.
      target.defendingPokemonExtraDamageRearmAfterAttack = true;
      return;
    }

    target.defendingPokemonExtraDamagePending = true;
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

/**
 * During the opponent's next turn, whenever they attach an Energy card from their hand
 * to the Defending Pokémon, place damage counters on that Pokémon.
 */
export class DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public damage: number) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.pendingEnergyAttachDamageCounters = {
      damage: this.damage,
      attack: this.attackEffect.attack,
      sourceCard: this.markerSource as PokemonCard,
      attackerPlayerId: this.player.id,
    };
  }
}

export function defendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  damage: number,
): DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect {
  const effect = new DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect(attackEffect, damage);
  effect.markerSource = source;
  return effect;
}

/**
 * The Defending Pokémon's Weakness is now the given type until the end of the
 * attacking player's next turn. Applied as ×2 (no Weakness amount).
 */
export class DefendingPokemonWeaknessIsNowEffect extends EffectOfAttackEffect {
  readonly type: string = 'DEFENDING_POKEMON_WEAKNESS_IS_NOW_EFFECT';

  constructor(base: AttackEffect, public weaknessType: CardType) {
    super(base);
  }

  applyEffect(): void {
    const target = this.opponent.active;
    target.weaknessOverrideType = this.weaknessType;
    target.weaknessOverrideAttackerId = this.player.id;
    target.weaknessOverrideClearArmed = false;
  }
}

export function defendingPokemonWeaknessIsNowEffect(
  attackEffect: AttackEffect,
  source: Card,
  weaknessType: CardType,
): DefendingPokemonWeaknessIsNowEffect {
  const effect = new DefendingPokemonWeaknessIsNowEffect(attackEffect, weaknessType);
  effect.markerSource = source;
  return effect;
}
