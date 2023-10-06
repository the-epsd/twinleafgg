"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealTargetEffect = exports.RemoveSpecialConditionsEffect = exports.AddSpecialConditionsEffect = exports.AddMarkerEffect = exports.DiscardCardsEffect = exports.PutCountersEffect = exports.AfterDamageEffect = exports.PutDamageEffect = exports.DealDamageEffect = exports.ApplyWeaknessEffect = exports.AbstractAttackEffect = exports.AttackEffects = void 0;
const card_types_1 = require("../card/card-types");
var AttackEffects;
(function (AttackEffects) {
    AttackEffects["APPLY_WEAKNESS_EFFECT"] = "APPLY_WEAKNESS_EFFECT";
    AttackEffects["DEAL_DAMAGE_EFFECT"] = "DEAL_DAMAGE_EFFECT";
    AttackEffects["PUT_DAMAGE_EFFECT"] = "PUT_DAMAGE_EFFECT";
    AttackEffects["AFTER_DAMAGE_EFFECT"] = "AFTER_DAMAGE_EFFECT";
    AttackEffects["PUT_COUNTERS_EFFECT"] = "PUT_COUNTERS_EFFECT";
    AttackEffects["DISCARD_CARD_EFFECT"] = "DISCARD_CARD_EFFECT";
    AttackEffects["ADD_MARKER_EFFECT"] = "ADD_MARKER_EFFECT";
    AttackEffects["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
    AttackEffects["MOVED_TO_ACTIVE_BONUS_EFFECT"] = "MOVED_TO_ACTIVE_BONUS_EFFECT";
})(AttackEffects = exports.AttackEffects || (exports.AttackEffects = {}));
class AbstractAttackEffect {
    constructor(base) {
        this.attackEffect = base;
        this.player = base.player;
        this.opponent = base.opponent;
        this.attack = base.attack;
        this.source = base.player.active;
        this.target = base.opponent.active;
    }
}
exports.AbstractAttackEffect = AbstractAttackEffect;
class ApplyWeaknessEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.APPLY_WEAKNESS_EFFECT;
        this.preventDefault = false;
        this.ignoreResistance = false;
        this.ignoreWeakness = false;
        this.damage = damage;
    }
}
exports.ApplyWeaknessEffect = ApplyWeaknessEffect;
class DealDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
exports.DealDamageEffect = DealDamageEffect;
class PutDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.PUT_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
exports.PutDamageEffect = PutDamageEffect;
class AfterDamageEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.AFTER_DAMAGE_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
exports.AfterDamageEffect = AfterDamageEffect;
class PutCountersEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.PUT_COUNTERS_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
exports.PutCountersEffect = PutCountersEffect;
class DiscardCardsEffect extends AbstractAttackEffect {
    constructor(base, energyCards) {
        super(base);
        this.type = AttackEffects.DISCARD_CARD_EFFECT;
        this.preventDefault = false;
        this.cards = energyCards;
    }
}
exports.DiscardCardsEffect = DiscardCardsEffect;
class AddMarkerEffect extends AbstractAttackEffect {
    constructor(base, markerName, markerSource) {
        super(base);
        this.type = AttackEffects.ADD_MARKER_EFFECT;
        this.preventDefault = false;
        this.markerName = markerName;
        this.markerSource = markerSource;
    }
}
exports.AddMarkerEffect = AddMarkerEffect;
class AddSpecialConditionsEffect extends AbstractAttackEffect {
    constructor(base, specialConditions) {
        super(base);
        this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        this.specialConditions = specialConditions;
    }
}
exports.AddSpecialConditionsEffect = AddSpecialConditionsEffect;
class RemoveSpecialConditionsEffect extends AbstractAttackEffect {
    constructor(base, specialConditions) {
        super(base);
        this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        if (specialConditions === undefined) {
            specialConditions = [
                card_types_1.SpecialCondition.PARALYZED,
                card_types_1.SpecialCondition.CONFUSED,
                card_types_1.SpecialCondition.ASLEEP,
                card_types_1.SpecialCondition.POISONED,
                card_types_1.SpecialCondition.BURNED
            ];
        }
        this.specialConditions = specialConditions;
    }
}
exports.RemoveSpecialConditionsEffect = RemoveSpecialConditionsEffect;
class HealTargetEffect extends AbstractAttackEffect {
    constructor(base, damage) {
        super(base);
        this.type = AttackEffects.ADD_MARKER_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
    }
}
exports.HealTargetEffect = HealTargetEffect;
