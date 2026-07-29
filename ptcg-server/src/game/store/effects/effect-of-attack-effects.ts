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
import { CardType, SpecialCondition, Stage } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList, PreventDamageFilter, SurviveOnTenHpOptions, RetaliateOnDamageOptions, StoredRetaliateOnDamage } from '../state/pokemon-card-list';
import { PendingEndOfTurnEffect } from '../state/pending-end-of-turn-effects';

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

export function shouldKnockOutIfDamaged(
  target: PokemonCardList,
  source: PokemonCardList,
): boolean {
  if (!target.knockOutIfDamagedNextTurn || target.knockOutIfDamagedNextTurnPending) {
    return false;
  }
  const filter = target.knockOutIfDamagedNextTurnFilter;
  if (!filter) {
    return true;
  }
  const sourceCard = source.getPokemonCard();
  if (!sourceCard) {
    return false;
  }
  return sourceMatchesPreventFilter(sourceCard, filter);
}

export function getActiveSurviveOnTenHpOptions(
  target: PokemonCardList,
): SurviveOnTenHpOptions | null {
  if (target.surviveOnTenHpNextTurnPending !== null) {
    return null;
  }
  return target.surviveOnTenHpNextTurn;
}

export function getActiveRetaliateOnDamage(
  target: PokemonCardList,
): StoredRetaliateOnDamage | null {
  if (target.retaliateOnDamageNextTurnPending !== null) {
    return null;
  }
  return target.retaliateOnDamageNextTurn;
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
 * During the opponent's next turn (or longer), prevent the target player(s)
 * from playing certain card types from hand. Locks live on the Player.
 */
export interface PlayLockOptions {
  item?: boolean;
  supporter?: boolean;
  stadium?: boolean;
  tool?: boolean;
  specialEnergy?: boolean;
  /** EndTurns of the locked player until clear. Default 1 (opponent's next turn). */
  turnsRemaining?: number;
  /** Also lock the attacking player (e.g. Vanilluxe Frigid Breath). */
  bothPlayers?: boolean;
  /** EndTurns for the attacker when bothPlayers. Default 2 (until end of your next turn). */
  attackerTurnsRemaining?: number;
}

export class PlayLockEffect extends EffectOfAttackEffect {
  readonly type: string = 'PLAY_LOCK_EFFECT';

  constructor(base: AttackEffect, public readonly options: PlayLockOptions) {
    super(base);
    // Player-level lock — not an effect done to the Defending Pokémon.
    // Using the defender as target lets Mist Energy / similar incorrectly block it.
    this.target = base.source;
  }

  applyEffect(): void {
    const locks = {
      item: this.options.item === true,
      supporter: this.options.supporter === true,
      stadium: this.options.stadium === true,
      tool: this.options.tool === true,
      specialEnergy: this.options.specialEnergy === true,
    };
    const opponentTurns = this.options.turnsRemaining ?? 1;
    this.opponent.applyPlayLocks(locks, opponentTurns);

    if (this.options.bothPlayers) {
      this.player.applyPlayLocks(locks, this.options.attackerTurnsRemaining ?? 2);
    }
  }
}

export function playLockEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: PlayLockOptions,
): PlayLockEffect {
  const effect = new PlayLockEffect(attackEffect, options);
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

export interface KnockOutIfDamagedOptions {
  /** Optional source filter (e.g. Rapid Strike only). */
  filter?: PreventDamageFilter;
}

/**
 * During your next turn, if the Defending Pokémon is damaged by an attack, it is Knocked Out.
 */
export class KnockOutIfDamagedDuringAttackerNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'KNOCK_OUT_IF_DAMAGED_DURING_ATTACKER_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public readonly options: KnockOutIfDamagedOptions = {}) {
    super(base);
  }

  applyEffect(): void {
    const target = this.opponent.active;
    target.knockOutIfDamagedNextTurn = true;
    target.knockOutIfDamagedNextTurnPending = true;
    target.knockOutIfDamagedNextTurnAttackerId = this.player.id;
    target.knockOutIfDamagedNextTurnFilter = this.options.filter ?? null;
    target.knockOutIfDamagedNextTurnAttack = this.attack;
    target.knockOutIfDamagedNextTurnSourceCard = this.markerSource as PokemonCard;
  }
}

export function knockOutIfDamagedDuringAttackerNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: KnockOutIfDamagedOptions = {},
): KnockOutIfDamagedDuringAttackerNextTurnEffect {
  const effect = new KnockOutIfDamagedDuringAttackerNextTurnEffect(attackEffect, options);
  effect.markerSource = source;
  return effect;
}

/**
 * During the opponent's next turn, if this Pokémon would be Knocked Out by damage
 * from an attack, it is not Knocked Out and its remaining HP becomes 10.
 */
export class SurviveOnTenHpDuringOpponentsNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'SURVIVE_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public readonly options: SurviveOnTenHpOptions = {}) {
    super(base);
    this.target = base.source;
  }

  applyEffect(): void {
    this.player.active.surviveOnTenHpNextTurnPending = { ...this.options };
  }
}

export function surviveOnTenHpDuringOpponentsNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: SurviveOnTenHpOptions = {},
): SurviveOnTenHpDuringOpponentsNextTurnEffect {
  const effect = new SurviveOnTenHpDuringOpponentsNextTurnEffect(attackEffect, options);
  effect.markerSource = source;
  return effect;
}

/**
 * During the opponent's next turn, if this Pokémon is damaged by an attack
 * (even if Knocked Out), put damage counters on / reflect damage to the attacker.
 */
export class RetaliateOnDamageDuringOpponentsNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'RETALIATE_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public readonly options: RetaliateOnDamageOptions) {
    super(base);
    this.target = base.source;
  }

  applyEffect(): void {
    this.player.active.retaliateOnDamageNextTurnPending = {
      ...this.options,
      attack: this.attack,
      sourceCard: this.markerSource as PokemonCard,
      attackerPlayerId: this.player.id,
    };
  }
}

/**
 * Places revenge-trap damage counters on the Attacking Pokémon.
 * Attributed to the Pokémon that used the revenge attack so Mist Energy / other
 * "prevent effects of attacks" effects can block it.
 */
export class RetaliateDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'RETALIATE_DAMAGE_EFFECT';

  constructor(base: AttackEffect, public readonly damage: number) {
    super(base);
  }

  applyEffect(): void {
    if (this.damage > 0) {
      this.target.damage += this.damage;
    }
  }
}

export function retaliateOnDamageDuringOpponentsNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  options: RetaliateOnDamageOptions,
): RetaliateOnDamageDuringOpponentsNextTurnEffect {
  const effect = new RetaliateOnDamageDuringOpponentsNextTurnEffect(attackEffect, options);
  effect.markerSource = source;
  return effect;
}

export function retaliateDamageEffect(
  attackEffect: AttackEffect,
  damage: number,
  target: PokemonCardList,
): RetaliateDamageEffect {
  const effect = new RetaliateDamageEffect(attackEffect, damage);
  effect.target = target;
  return effect;
}

/**
 * If the Defending Pokémon is Knocked Out during your next turn, take N more Prize cards.
 */
export class ExtraPrizesIfKnockedOutDuringAttackerNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'EXTRA_PRIZES_IF_KNOCKED_OUT_DURING_ATTACKER_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public readonly extraPrizes: number) {
    super(base);
  }

  applyEffect(): void {
    const target = this.opponent.active;
    target.extraPrizesIfKnockedOutNextTurn = this.extraPrizes;
    target.extraPrizesIfKnockedOutNextTurnPending = true;
    target.extraPrizesIfKnockedOutNextTurnAttackerId = this.player.id;
  }
}

export function extraPrizesIfKnockedOutDuringAttackerNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  extraPrizes: number,
): ExtraPrizesIfKnockedOutDuringAttackerNextTurnEffect {
  const effect = new ExtraPrizesIfKnockedOutDuringAttackerNextTurnEffect(attackEffect, extraPrizes);
  effect.markerSource = source;
  return effect;
}

/**
 * During the opponent's next turn, if this Pokémon is Knocked Out, deny Prize cards.
 */
export class DenyPrizesIfKnockedOutDuringOpponentsNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'DENY_PRIZES_IF_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
    this.target = base.source;
  }

  applyEffect(): void {
    this.player.active.denyPrizesIfKnockedOutNextTurnPending = true;
  }
}

export function denyPrizesIfKnockedOutDuringOpponentsNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
): DenyPrizesIfKnockedOutDuringOpponentsNextTurnEffect {
  const effect = new DenyPrizesIfKnockedOutDuringOpponentsNextTurnEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

/**
 * During the opponent's next turn, if this Pokémon is Knocked Out by damage from an
 * attack, discard an Energy attached to the Attacking Pokémon.
 */
export class DiscardAttackerEnergyIfKnockedOutDuringOpponentsNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'DISCARD_ATTACKER_ENERGY_IF_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
    this.target = base.source;
  }

  applyEffect(): void {
    this.player.active.discardAttackerEnergyIfKnockedOutNextTurn = true;
    this.player.active.discardAttackerEnergyIfKnockedOutNextTurnPending = true;
    this.player.active.discardAttackerEnergyIfKnockedOutNextTurnAttack = this.attack;
    this.player.active.discardAttackerEnergyIfKnockedOutNextTurnSourceCard = this.markerSource as PokemonCard;
    this.player.active.discardAttackerEnergyIfKnockedOutNextTurnAttackerId = this.player.id;
  }
}

export function discardAttackerEnergyIfKnockedOutDuringOpponentsNextTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
): DiscardAttackerEnergyIfKnockedOutDuringOpponentsNextTurnEffect {
  const effect = new DiscardAttackerEnergyIfKnockedOutDuringOpponentsNextTurnEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export type ScheduleEndOfTurnPending =
  | { type: 'knock_out' }
  | { type: 'discard' }
  | { type: 'damage_counters'; damage: number }
  | { type: 'special_condition'; specialCondition: SpecialCondition };

/**
 * Schedules a delayed effect on the Defending Pokémon for the end of their next turn.
 * Mist Energy / prevent-effects-of-attacks can block this arming EffectOfAttack.
 */
export class ScheduleDefendingPokemonEndOfTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'SCHEDULE_DEFENDING_POKEMON_END_OF_TURN_EFFECT';

  constructor(
    base: AttackEffect,
    public readonly pending: ScheduleEndOfTurnPending,
  ) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.pendingEndOfTurnEffects.push({
      target: this.target,
      attack: this.attack,
      sourceCard: this.markerSource as PokemonCard,
      attackerPlayerId: this.player.id,
      ...this.pending,
    } as PendingEndOfTurnEffect);
  }
}

export function scheduleDefendingPokemonEndOfTurnEffect(
  attackEffect: AttackEffect,
  source: Card,
  pending: ScheduleEndOfTurnPending,
  target?: PokemonCardList,
): ScheduleDefendingPokemonEndOfTurnEffect {
  const effect = new ScheduleDefendingPokemonEndOfTurnEffect(attackEffect, pending);
  effect.markerSource = source;
  if (target) {
    effect.target = target;
  }
  return effect;
}
