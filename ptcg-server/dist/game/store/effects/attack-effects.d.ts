import { Card } from '../card/card';
import { SpecialCondition } from '../card/card-types';
import { Attack } from '../card/pokemon-types';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Effect } from './effect';
import { AttackEffect } from './game-effects';
export declare enum AttackEffects {
    APPLY_WEAKNESS_EFFECT = "APPLY_WEAKNESS_EFFECT",
    DEAL_DAMAGE_EFFECT = "DEAL_DAMAGE_EFFECT",
    PUT_DAMAGE_EFFECT = "PUT_DAMAGE_EFFECT",
    KNOCK_OUT_OPPONENT_EFFECT = "KNOCK_OUT_OPPONENT_EFFECT",
    AFTER_DAMAGE_EFFECT = "AFTER_DAMAGE_EFFECT",
    PUT_COUNTERS_EFFECT = "PUT_COUNTERS_EFFECT",
    DISCARD_CARD_EFFECT = "DISCARD_CARD_EFFECT",
    CARDS_TO_HAND_EFFECT = "CARDS_TO_HAND_EFFECT",
    GUST_OPPONENT_BENCH_EFFECT = "GUST_OPPONENT_BENCH_EFFECT",
    ADD_MARKER_EFFECT = "ADD_MARKER_EFFECT",
    ADD_SPECIAL_CONDITIONS_EFFECT = "ADD_SPECIAL_CONDITIONS_EFFECT",
    MOVED_TO_ACTIVE_BONUS_EFFECT = "MOVED_TO_ACTIVE_BONUS_EFFECT",
    LOST_ZONED_CARDS_EFFECT = "LOST_ZONED_CARDS_EFFECT"
}
export declare abstract class AbstractAttackEffect {
    attackEffect: AttackEffect;
    attack: Attack;
    player: Player;
    opponent: Player;
    target: PokemonCardList;
    source: PokemonCardList;
    constructor(base: AttackEffect);
}
export declare class ApplyWeaknessEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    ignoreResistance: boolean;
    ignoreWeakness: boolean;
    constructor(base: AttackEffect, damage: number);
}
export declare class DealDamageEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    constructor(base: AttackEffect, damage: number);
}
export declare class PutDamageEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    damageReduced: boolean;
    damageIncreased: boolean;
    wasKnockedOutFromFullHP: boolean;
    weaknessApplied: boolean;
    constructor(base: AttackEffect, damage: number);
}
export declare class AfterDamageEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    constructor(base: AttackEffect, damage: number);
}
export declare class PutCountersEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    constructor(base: AttackEffect, damage: number);
}
export declare class KOEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    damageReduced: boolean;
    wasKnockedOutFromFullHP: boolean;
    constructor(base: AttackEffect, damage: number);
}
export declare class GustOpponentBenchEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    target: PokemonCardList;
    constructor(base: AttackEffect, target: PokemonCardList);
}
export declare class KnockOutOpponentEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    constructor(base: AttackEffect, damage: number);
}
export declare class DiscardCardsEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    cards: Card[];
    constructor(base: AttackEffect, energyCards: Card[]);
}
export declare class LostZoneCardsEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    cards: Card[];
    constructor(base: AttackEffect, energyCards: Card[]);
}
export declare class CardsToHandEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    cards: Card[];
    constructor(base: AttackEffect, energyCards: Card[]);
}
export declare class AddMarkerEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    markerName: string;
    markerSource: Card;
    constructor(base: AttackEffect, markerName: string, markerSource: Card);
}
export declare class AddSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    poisonDamage?: number;
    specialConditions: SpecialCondition[];
    constructor(base: AttackEffect, specialConditions: SpecialCondition[]);
}
export declare class RemoveSpecialConditionsEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    specialConditions: SpecialCondition[];
    constructor(base: AttackEffect, specialConditions: SpecialCondition[] | undefined);
}
export declare class HealTargetEffect extends AbstractAttackEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    damage: number;
    constructor(base: AttackEffect, damage: number);
}
