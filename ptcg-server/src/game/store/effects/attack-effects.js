"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.HealTargetEffect = exports.RemoveSpecialConditionsEffect = exports.AddSpecialConditionsEffect = exports.AddMarkerEffect = exports.CardsToHandEffect = exports.LostZoneCardsEffect = exports.DiscardCardsEffect = exports.KnockOutOpponentEffect = exports.GustOpponentBenchEffect = exports.KOEffect = exports.PutCountersEffect = exports.AfterDamageEffect = exports.PutDamageEffect = exports.DealDamageEffect = exports.ApplyWeaknessEffect = exports.AbstractAttackEffect = exports.AttackEffects = void 0;
var card_types_1 = require("../card/card-types");
var AttackEffects;
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
})(AttackEffects = exports.AttackEffects || (exports.AttackEffects = {}));
var AbstractAttackEffect = /** @class */ (function () {
    function AbstractAttackEffect(base) {
        this.attackEffect = base;
        this.player = base.player;
        this.opponent = base.opponent;
        this.attack = base.attack;
        this.source = base.player.active;
        this.target = base.opponent.active;
    }
    return AbstractAttackEffect;
}());
exports.AbstractAttackEffect = AbstractAttackEffect;
var ApplyWeaknessEffect = /** @class */ (function (_super) {
    __extends(ApplyWeaknessEffect, _super);
    function ApplyWeaknessEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.APPLY_WEAKNESS_EFFECT;
        _this.preventDefault = false;
        _this.ignoreResistance = false;
        _this.ignoreWeakness = false;
        _this.damage = damage;
        return _this;
    }
    return ApplyWeaknessEffect;
}(AbstractAttackEffect));
exports.ApplyWeaknessEffect = ApplyWeaknessEffect;
var DealDamageEffect = /** @class */ (function (_super) {
    __extends(DealDamageEffect, _super);
    function DealDamageEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
        _this.preventDefault = false;
        _this.damage = damage;
        return _this;
    }
    return DealDamageEffect;
}(AbstractAttackEffect));
exports.DealDamageEffect = DealDamageEffect;
var PutDamageEffect = /** @class */ (function (_super) {
    __extends(PutDamageEffect, _super);
    function PutDamageEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.PUT_DAMAGE_EFFECT;
        _this.preventDefault = false;
        _this.damageReduced = false;
        _this.damageIncreased = true;
        _this.wasKnockedOutFromFullHP = false;
        _this.weaknessApplied = false;
        _this.damage = damage;
        return _this;
    }
    return PutDamageEffect;
}(AbstractAttackEffect));
exports.PutDamageEffect = PutDamageEffect;
var AfterDamageEffect = /** @class */ (function (_super) {
    __extends(AfterDamageEffect, _super);
    function AfterDamageEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.AFTER_DAMAGE_EFFECT;
        _this.preventDefault = false;
        _this.damage = damage;
        return _this;
    }
    return AfterDamageEffect;
}(AbstractAttackEffect));
exports.AfterDamageEffect = AfterDamageEffect;
var PutCountersEffect = /** @class */ (function (_super) {
    __extends(PutCountersEffect, _super);
    function PutCountersEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.PUT_COUNTERS_EFFECT;
        _this.preventDefault = false;
        _this.damage = damage;
        return _this;
    }
    return PutCountersEffect;
}(AbstractAttackEffect));
exports.PutCountersEffect = PutCountersEffect;
var KOEffect = /** @class */ (function (_super) {
    __extends(KOEffect, _super);
    function KOEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.PUT_DAMAGE_EFFECT;
        _this.preventDefault = false;
        _this.damageReduced = false;
        _this.wasKnockedOutFromFullHP = false;
        _this.damage = damage;
        return _this;
    }
    return KOEffect;
}(AbstractAttackEffect));
exports.KOEffect = KOEffect;
var GustOpponentBenchEffect = /** @class */ (function (_super) {
    __extends(GustOpponentBenchEffect, _super);
    function GustOpponentBenchEffect(base, target) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.GUST_OPPONENT_BENCH_EFFECT;
        _this.preventDefault = false;
        _this.target = target;
        return _this;
    }
    return GustOpponentBenchEffect;
}(AbstractAttackEffect));
exports.GustOpponentBenchEffect = GustOpponentBenchEffect;
var KnockOutOpponentEffect = /** @class */ (function (_super) {
    __extends(KnockOutOpponentEffect, _super);
    function KnockOutOpponentEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
        _this.preventDefault = false;
        _this.damage = damage;
        return _this;
    }
    return KnockOutOpponentEffect;
}(AbstractAttackEffect));
exports.KnockOutOpponentEffect = KnockOutOpponentEffect;
var DiscardCardsEffect = /** @class */ (function (_super) {
    __extends(DiscardCardsEffect, _super);
    function DiscardCardsEffect(base, energyCards) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.DISCARD_CARD_EFFECT;
        _this.preventDefault = false;
        _this.cards = energyCards;
        return _this;
    }
    return DiscardCardsEffect;
}(AbstractAttackEffect));
exports.DiscardCardsEffect = DiscardCardsEffect;
var LostZoneCardsEffect = /** @class */ (function (_super) {
    __extends(LostZoneCardsEffect, _super);
    function LostZoneCardsEffect(base, energyCards) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.LOST_ZONED_CARDS_EFFECT;
        _this.preventDefault = false;
        _this.cards = energyCards;
        return _this;
    }
    return LostZoneCardsEffect;
}(AbstractAttackEffect));
exports.LostZoneCardsEffect = LostZoneCardsEffect;
var CardsToHandEffect = /** @class */ (function (_super) {
    __extends(CardsToHandEffect, _super);
    function CardsToHandEffect(base, energyCards) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.DISCARD_CARD_EFFECT;
        _this.preventDefault = false;
        _this.cards = energyCards;
        return _this;
    }
    return CardsToHandEffect;
}(AbstractAttackEffect));
exports.CardsToHandEffect = CardsToHandEffect;
var AddMarkerEffect = /** @class */ (function (_super) {
    __extends(AddMarkerEffect, _super);
    function AddMarkerEffect(base, markerName, markerSource) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.ADD_MARKER_EFFECT;
        _this.preventDefault = false;
        _this.markerName = markerName;
        _this.markerSource = markerSource;
        return _this;
    }
    return AddMarkerEffect;
}(AbstractAttackEffect));
exports.AddMarkerEffect = AddMarkerEffect;
var AddSpecialConditionsEffect = /** @class */ (function (_super) {
    __extends(AddSpecialConditionsEffect, _super);
    function AddSpecialConditionsEffect(base, specialConditions) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        _this.preventDefault = false;
        _this.specialConditions = specialConditions;
        return _this;
    }
    return AddSpecialConditionsEffect;
}(AbstractAttackEffect));
exports.AddSpecialConditionsEffect = AddSpecialConditionsEffect;
var RemoveSpecialConditionsEffect = /** @class */ (function (_super) {
    __extends(RemoveSpecialConditionsEffect, _super);
    function RemoveSpecialConditionsEffect(base, specialConditions) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        _this.preventDefault = false;
        if (specialConditions === undefined) {
            specialConditions = [
                card_types_1.SpecialCondition.PARALYZED,
                card_types_1.SpecialCondition.CONFUSED,
                card_types_1.SpecialCondition.ASLEEP,
                card_types_1.SpecialCondition.POISONED,
                card_types_1.SpecialCondition.BURNED
            ];
        }
        _this.specialConditions = specialConditions;
        return _this;
    }
    return RemoveSpecialConditionsEffect;
}(AbstractAttackEffect));
exports.RemoveSpecialConditionsEffect = RemoveSpecialConditionsEffect;
var HealTargetEffect = /** @class */ (function (_super) {
    __extends(HealTargetEffect, _super);
    function HealTargetEffect(base, damage) {
        var _this = _super.call(this, base) || this;
        _this.type = AttackEffects.ADD_MARKER_EFFECT;
        _this.preventDefault = false;
        _this.damage = damage;
        return _this;
    }
    return HealTargetEffect;
}(AbstractAttackEffect));
exports.HealTargetEffect = HealTargetEffect;
