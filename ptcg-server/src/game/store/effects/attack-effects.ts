import { Card } from '../card/card';
import { SpecialCondition } from '../card/card-types';
import { Attack } from '../card/pokemon-types';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Effect } from './effect';
import { AttackEffect } from './game-effects';
import { AfterAttackEffect } from './game-phase-effects';

export enum AttackEffects {
  APPLY_WEAKNESS_EFFECT = 'APPLY_WEAKNESS_EFFECT',
  DEAL_DAMAGE_EFFECT = 'DEAL_DAMAGE_EFFECT',
  PUT_DAMAGE_EFFECT = 'PUT_DAMAGE_EFFECT',
  KNOCK_OUT_OPPONENT_EFFECT = 'KNOCK_OUT_OPPONENT_EFFECT',
  KNOCK_OUT_PLAYER_EFFECT = 'KNOCK_OUT_PLAYER_EFFECT',
  AFTER_DAMAGE_EFFECT = 'AFTER_DAMAGE_EFFECT',
  PUT_COUNTERS_EFFECT = 'PUT_COUNTERS_EFFECT',
  DISCARD_CARD_EFFECT = 'DISCARD_CARD_EFFECT',
  DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_EFFECT = 'DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_EFFECT',
  DISCARD_DEFENDING_POKEMON_EFFECT = 'DISCARD_DEFENDING_POKEMON_EFFECT',
  CARDS_TO_HAND_EFFECT = 'CARDS_TO_HAND_EFFECT',
  GUST_OPPONENT_BENCH_EFFECT = 'GUST_OPPONENT_BENCH_EFFECT',
  SWITCH_OUT_OPPONENTS_ACTIVE_EFFECT = 'SWITCH_OUT_OPPONENTS_ACTIVE_EFFECT',
  ADD_MARKER_EFFECT = 'ADD_MARKER_EFFECT',
  ADD_SPECIAL_CONDITIONS_EFFECT = 'ADD_SPECIAL_CONDITIONS_EFFECT',
  MOVED_TO_ACTIVE_BONUS_EFFECT = 'MOVED_TO_ACTIVE_BONUS_EFFECT',
  LOST_ZONED_CARDS_EFFECT = 'LOST_ZONED_CARDS_EFFECT',
  AFTER_WEAKNESS_AND_RESISTANCE_EFFECT = 'AFTER_WEAKNESS_AND_RESISTANCE_EFFECT',
  MOVE_OPPONENT_ENERGY_EFFECT = 'MOVE_OPPONENT_ENERGY_EFFECT',
  MOVE_COUNTERS_EFFECT = 'MOVE_COUNTERS_EFFECT',
}

export abstract class AbstractAttackEffect {
  public attackEffect: AttackEffect;
  public attack: Attack;
  public player: Player;
  public opponent: Player;
  public target: PokemonCardList;
  public source: PokemonCardList;
  public preventDefault = false;

  constructor(base: AttackEffect | AbstractAttackEffect) {
    // Extract attackEffect if base is an AbstractAttackEffect (has attackEffect property), otherwise use base directly
    const attackEffect = 'attackEffect' in base ? base.attackEffect : base;
    this.attackEffect = attackEffect;
    this.player = attackEffect.player;
    this.opponent = attackEffect.opponent;
    this.attack = attackEffect.attack;
    this.source = attackEffect.source;
    this.target = attackEffect.opponent.active;
  }
}

export class ApplyWeaknessEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.APPLY_WEAKNESS_EFFECT;
  public preventDefault = false;
  public damage: number;
  public ignoreResistance = false;
  public ignoreWeakness = false;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class DealDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DEAL_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;
  public damageIncreased = false;
  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class PutDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.PUT_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;
  public damageIncreased = true;
  public wasKnockedOutFromFullHP: boolean = false;
  public surviveOnTenHPReason: undefined | string = undefined;
  public weaknessApplied: boolean = false;

  private nonstackingDamageReducers: string[] = [];

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }

  reduceDamage(amount: number, source: string | undefined = undefined): void {
    if (source && this.nonstackingDamageReducers.includes(source)) {
      return;
    }
    this.damage = Math.max(0, this.damage - amount);
    if (source) {
      this.nonstackingDamageReducers.push(source);
    }
  }
}

export class AfterWeaknessAndResistanceEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.AFTER_WEAKNESS_AND_RESISTANCE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class AfterDamageEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.AFTER_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class PutCountersEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.PUT_COUNTERS_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect | AbstractAttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

// Moves damage counters from one Pokemon to another as part of an attack
// (e.g. Dedenne ex's Tail Swap). Unlike MoveDamageCountersEffect (a power/UI
// hook), this carries an explicit source/target/amount and has no move UI.
export class MoveCountersAttackEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.MOVE_COUNTERS_EFFECT;
  public preventDefault = false;
  public source: PokemonCardList;
  public target: PokemonCardList;
  public damage: number;

  constructor(base: AttackEffect | AbstractAttackEffect, source: PokemonCardList, target: PokemonCardList, damage: number) {
    super(base);
    this.source = source;
    this.target = target;
    this.damage = damage;
  }
}

export class KOEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.PUT_DAMAGE_EFFECT;
  public preventDefault = false;
  public damage: number;
  public damageReduced = false;
  public wasKnockedOutFromFullHP: boolean = false;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}

export class GustOpponentBenchEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.GUST_OPPONENT_BENCH_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;

  constructor(base: AttackEffect | AfterAttackEffect, target: PokemonCardList) {
    super(base instanceof AfterAttackEffect
      ? new AttackEffect(base.player, base.opponent, base.attack)
      : base);
    this.target = target;
  }
}

export class SwitchOutOpponentsActiveEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.SWITCH_OUT_OPPONENTS_ACTIVE_EFFECT;
  public preventDefault = false;
  public benchTarget?: PokemonCardList;

  constructor(base: AttackEffect | AfterAttackEffect) {
    super(base instanceof AfterAttackEffect
      ? new AttackEffect(base.player, base.opponent, base.attack)
      : base);
  }
}

export class KnockOutOpponentEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.KNOCK_OUT_OPPONENT_EFFECT;
  public preventDefault = false;
  public knockedOut = false;
  public prizeCount = 0;

  constructor(base: AttackEffect) {
    super(base);
  }
}

export class KnockOutPlayerEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.KNOCK_OUT_PLAYER_EFFECT;
  public preventDefault = false;
  public knockedOut = false;
  public prizeCount = 0;

  constructor(base: AttackEffect) {
    super(base);
  }
}

export class DiscardCardsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_CARD_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(base: AttackEffect, energyCards: Card[]) {
    super(base);
    this.cards = energyCards;
  }
}

export class DiscardCardsFromOpponentsActivePokemonEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_CARDS_FROM_OPPONENTS_ACTIVE_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(base: AttackEffect, cards: Card[]) {
    super(base);
    this.cards = cards;
    this.target = base.opponent.active;
  }
}

export class DiscardDefendingPokemonEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_DEFENDING_POKEMON_EFFECT;
  public preventDefault = false;
  public discarded = false;

  constructor(base: AttackEffect) {
    super(base);
  }
}

export class LostZoneCardsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.LOST_ZONED_CARDS_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(base: AttackEffect, energyCards: Card[]) {
    super(base);
    this.cards = energyCards;
  }
}

export class CardsToHandEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.DISCARD_CARD_EFFECT;
  public preventDefault = false;
  public cards: Card[];

  constructor(base: AttackEffect, energyCards: Card[]) {
    super(base);
    this.cards = energyCards;
  }
}

export class MoveOpponentEnergyEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.MOVE_OPPONENT_ENERGY_EFFECT;
  public preventDefault = false;
  public card: Card;
  public destination: PokemonCardList;

  constructor(base: AttackEffect, card: Card, source: PokemonCardList, destination: PokemonCardList) {
    super(base);
    this.card = card;
    this.target = source;
    this.destination = destination;
  }
}

export class AddMarkerEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public markerName: string;
  public markerSource: Card;

  constructor(base: AttackEffect, markerName: string, markerSource: Card) {
    super(base);
    this.markerName = markerName;
    this.markerSource = markerSource;
  }
}

export class AddSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
  public preventDefault = false;
  public poisonDamage?: number;
  public burnDamage?: number;
  public confusionDamage?: number;
  public specialConditions: SpecialCondition[];

  constructor(base: AttackEffect, specialConditions: SpecialCondition[]) {
    super(base);
    this.specialConditions = specialConditions;
  }
}

export class RemoveSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
  public preventDefault = false;
  public specialConditions: SpecialCondition[];

  constructor(base: AttackEffect, specialConditions: SpecialCondition[] | undefined) {
    super(base);
    if (specialConditions === undefined) {
      specialConditions = [
        SpecialCondition.PARALYZED,
        SpecialCondition.CONFUSED,
        SpecialCondition.ASLEEP,
        SpecialCondition.POISONED,
        SpecialCondition.BURNED
      ];
    }
    this.specialConditions = specialConditions;
  }
}

export class HealTargetEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = AttackEffects.ADD_MARKER_EFFECT;
  public preventDefault = false;
  public damage: number;

  constructor(base: AttackEffect, damage: number) {
    super(base);
    this.damage = damage;
  }
}
