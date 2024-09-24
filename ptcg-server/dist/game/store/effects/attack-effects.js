import { SpecialCondition } from '../card/card-types';
export var AttackEffects;
(function (AttackEffects) {
    AttackEffects["APPLY_WEAKNESS_EFFECT"] = "APPLY_WEAKNESS_EFFECT";
    AttackEffects["DEAL_DAMAGE_EFFECT"] = "DEAL_DAMAGE_EFFECT";
    AttackEffects["PUT_DAMAGE_EFFECT"] = "PUT_DAMAGE_EFFECT";
    AttackEffects["KNOCK_OUT_OPPONENT_EFFECT"] = "KNOCK_OUT_OPPONENT_EFFECT";
    AttackEffects["AFTER_DAMAGE_EFFECT"] = "AFTER_DAMAGE_EFFECT";
    AttackEffects["PUT_COUNTERS_EFFECT"] = "PUT_COUNTERS_EFFECT";
    AttackEffects["DISCARD_CARD_EFFECT"] = "DISCARD_CARD_EFFECT";
    AttackEffects["CARDS_TO_HAND_EFFECT"] = "CARDS_TO_HAND_EFFECT";
    AttackEffects["GUST_OPPONENT_BENCH_EFFECT"] = "GUST_OPPONENT_BENCH_EFFECT";
    AttackEffects["ADD_MARKER_EFFECT"] = "ADD_MARKER_EFFECT";
    AttackEffects["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
    AttackEffects["MOVED_TO_ACTIVE_BONUS_EFFECT"] = "MOVED_TO_ACTIVE_BONUS_EFFECT";
    AttackEffects["LOST_ZONED_CARDS_EFFECT"] = "LOST_ZONED_CARDS_EFFECT";
})(AttackEffects || (AttackEffects = {}));
export class AbstractAttackEffect {
    constructor(base) {
        this.attackEffect = base;
        this.player = base.player;
        this.opponent = base.opponent;
        this.attack = base.attack;
        this.source = base.player.active;
        this.target = base.opponent.active;
    }
}
export class ApplyWeaknessEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.APPLY_WEAKNESS_EFFECT;
        this.preventDefault = false;
        this.ignoreResistance = false;
        this.ignoreWeakness = false;
        this.damage = damage;
    }
}
export class DealDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
export class PutDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.PUT_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damageReduced = false;
        this.damageIncreased = true;
        this.wasKnockedOutFromFullHP = false;
        this.weaknessApplied = false;
        this.damage = damage;
    }
}
export class AfterDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.AFTER_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
export class PutCountersEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.PUT_COUNTERS_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
export class KOEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.PUT_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damageReduced = false;
        this.wasKnockedOutFromFullHP = false;
        this.damage = damage;
    }
}
export class GustOpponentBenchEffect extends AbstractAttackEffect {
    constructor(base, target) {
        super(base);
        this.type = AttackEffects.GUST_OPPONENT_BENCH_EFFECT;
        this.preventDefault = false;
        this.target = target;
    }
}
export class KnockOutOpponentEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
export class DiscardCardsEffect extends AbstractAttackEffect {
    constructor(base, energyCards) {
        super(base);
        this.type = AttackEffects.DISCARD_CARD_EFFECT;
        this.preventDefault = false;
        this.cards = energyCards;
    }
}
export class LostZoneCardsEffect extends AbstractAttackEffect {
    constructor(base, energyCards) {
        super(base);
        this.type = AttackEffects.LOST_ZONED_CARDS_EFFECT;
        this.preventDefault = false;
        this.cards = energyCards;
    }
}
export class CardsToHandEffect extends AbstractAttackEffect {
    constructor(base, energyCards) {
        super(base);
        this.type = AttackEffects.DISCARD_CARD_EFFECT;
        this.preventDefault = false;
        this.cards = energyCards;
    }
}
export class AddMarkerEffect extends AbstractAttackEffect {
    constructor(base, markerName, markerSource) {
        super(base);
        this.type = AttackEffects.ADD_MARKER_EFFECT;
        this.preventDefault = false;
        this.markerName = markerName;
        this.markerSource = markerSource;
    }
}
export class AddSpecialConditionsEffect extends AbstractAttackEffect {
    constructor(base, specialConditions) {
        super(base);
        this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        this.specialConditions = specialConditions;
    }
}
export class RemoveSpecialConditionsEffect extends AbstractAttackEffect {
    constructor(base, specialConditions) {
        super(base);
        this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
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
export class HealTargetEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.ADD_MARKER_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
