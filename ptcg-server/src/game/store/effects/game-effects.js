"use strict";
exports.__esModule = true;
exports.MoveCardsEffect = exports.DrawPrizesEffect = exports.EvolveEffect = exports.HealEffect = exports.KnockOutAttackEffect = exports.KnockOutEffect = exports.AttackEffect = exports.UseStadiumEffect = exports.UseAttackEffect = exports.TrainerPowerEffect = exports.PowerEffect = exports.UseTrainerPowerEffect = exports.UsePowerEffect = exports.RetreatEffect = exports.GameEffects = void 0;
var GameEffects;
(function (GameEffects) {
    GameEffects["RETREAT_EFFECT"] = "RETREAT_EFFECT";
    GameEffects["USE_ATTACK_EFFECT"] = "USE_ATTACK_EFFECT";
    GameEffects["USE_STADIUM_EFFECT"] = "USE_STADIUM_EFFECT";
    GameEffects["USE_POWER_EFFECT"] = "USE_POWER_EFFECT";
    GameEffects["POWER_EFFECT"] = "POWER_EFFECT";
    GameEffects["ATTACK_EFFECT"] = "ATTACK_EFFECT";
    GameEffects["KNOCK_OUT_EFFECT"] = "KNOCK_OUT_EFFECT";
    GameEffects["HEAL_EFFECT"] = "HEAL_EFFECT";
    GameEffects["EVOLVE_EFFECT"] = "EVOLVE_EFFECT";
    GameEffects["DRAW_PRIZES_EFFECT"] = "DRAW_PRIZES_EFFECT";
    GameEffects["MOVE_CARDS_EFFECT"] = "MOVE_CARDS_EFFECT";
})(GameEffects = exports.GameEffects || (exports.GameEffects = {}));
var RetreatEffect = /** @class */ (function () {
    function RetreatEffect(player, benchIndex) {
        this.type = GameEffects.RETREAT_EFFECT;
        this.preventDefault = false;
        this.ignoreStatusConditions = false;
        this.player = player;
        this.benchIndex = benchIndex;
        this.moveRetreatCostTo = player.discard;
    }
    return RetreatEffect;
}());
exports.RetreatEffect = RetreatEffect;
var UsePowerEffect = /** @class */ (function () {
    function UsePowerEffect(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
    return UsePowerEffect;
}());
exports.UsePowerEffect = UsePowerEffect;
var UseTrainerPowerEffect = /** @class */ (function () {
    function UseTrainerPowerEffect(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
    return UseTrainerPowerEffect;
}());
exports.UseTrainerPowerEffect = UseTrainerPowerEffect;
var PowerEffect = /** @class */ (function () {
    function PowerEffect(player, power, card) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
    }
    return PowerEffect;
}());
exports.PowerEffect = PowerEffect;
var TrainerPowerEffect = /** @class */ (function () {
    function TrainerPowerEffect(player, power, card) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
    }
    return TrainerPowerEffect;
}());
exports.TrainerPowerEffect = TrainerPowerEffect;
var UseAttackEffect = /** @class */ (function () {
    function UseAttackEffect(player, attack) {
        this.type = GameEffects.USE_ATTACK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
    }
    return UseAttackEffect;
}());
exports.UseAttackEffect = UseAttackEffect;
var UseStadiumEffect = /** @class */ (function () {
    function UseStadiumEffect(player, stadium) {
        this.type = GameEffects.USE_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.stadium = stadium;
    }
    return UseStadiumEffect;
}());
exports.UseStadiumEffect = UseStadiumEffect;
var AttackEffect = /** @class */ (function () {
    function AttackEffect(player, opponent, attack) {
        this.type = GameEffects.ATTACK_EFFECT;
        this.preventDefault = false;
        this.ignoreWeakness = false;
        this.ignoreResistance = false;
        this.player = player;
        this.opponent = opponent;
        this.attack = attack;
        this.damage = attack.damage;
        this.source = player.active;
    }
    return AttackEffect;
}());
exports.AttackEffect = AttackEffect;
// how many prizes when target Pokemon is KO
var KnockOutEffect = /** @class */ (function () {
    function KnockOutEffect(player, target) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.isLostCity = false;
        this.player = player;
        this.target = target;
        this.prizeCount = 1;
    }
    return KnockOutEffect;
}());
exports.KnockOutEffect = KnockOutEffect;
// how many prizes when target Pokemon is KO
var KnockOutAttackEffect = /** @class */ (function () {
    function KnockOutAttackEffect(player, target, attack) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.attack = attack;
        this.prizeCount = 1;
    }
    return KnockOutAttackEffect;
}());
exports.KnockOutAttackEffect = KnockOutAttackEffect;
var HealEffect = /** @class */ (function () {
    function HealEffect(player, target, damage) {
        this.type = GameEffects.HEAL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.damage = damage;
    }
    return HealEffect;
}());
exports.HealEffect = HealEffect;
var EvolveEffect = /** @class */ (function () {
    function EvolveEffect(player, target, pokemonCard) {
        this.type = GameEffects.EVOLVE_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonCard = pokemonCard;
    }
    return EvolveEffect;
}());
exports.EvolveEffect = EvolveEffect;
var DrawPrizesEffect = /** @class */ (function () {
    function DrawPrizesEffect(player, prizes, destination) {
        this.type = GameEffects.DRAW_PRIZES_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.prizes = prizes;
        this.destination = destination;
    }
    return DrawPrizesEffect;
}());
exports.DrawPrizesEffect = DrawPrizesEffect;
var MoveCardsEffect = /** @class */ (function () {
    function MoveCardsEffect(source, destination, options) {
        if (options === void 0) { options = {}; }
        this.type = GameEffects.MOVE_CARDS_EFFECT;
        this.preventDefault = false;
        this.source = source;
        this.destination = destination;
        this.cards = options.cards;
        this.count = options.count;
        this.toTop = options.toTop;
        this.toBottom = options.toBottom;
        this.skipCleanup = options.skipCleanup;
    }
    return MoveCardsEffect;
}());
exports.MoveCardsEffect = MoveCardsEffect;
