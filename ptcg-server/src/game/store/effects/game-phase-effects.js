"use strict";
exports.__esModule = true;
exports.BetweenTurnsEffect = exports.WhoBeginsEffect = exports.EndTurnEffect = exports.ChoosePrizeEffect = exports.AfterAttackEffect = exports.ChooseStartingPokemonEffect = exports.DrewTopdeckEffect = exports.BeginTurnEffect = exports.GamePhaseEffects = void 0;
var GamePhaseEffects;
(function (GamePhaseEffects) {
    GamePhaseEffects["BEGIN_TURN_EFFECT"] = "BEGIN_TURN_EFFECT";
    GamePhaseEffects["END_TURN_EFFECT"] = "END_TURN_EFFECT";
    GamePhaseEffects["WHO_BEGINS_EFFECT"] = "WHO_BEGINS_EFFECT";
    GamePhaseEffects["BETWEEN_TURNS_EFFECT"] = "BETWEEN_TURNS_EFFECT";
    GamePhaseEffects["CHOOSE_STARTING_POKEMON_EFFECT"] = "CHOOSE_STARTING_POKEMON_EFFECT";
    GamePhaseEffects["DREW_TOPDECK_EFFECT"] = "DREW_TOPDECK_EFFECT";
    GamePhaseEffects["CHOOSE_PRIZE_EFFECT"] = "CHOOSE_PRIZE_EFFECT";
    GamePhaseEffects["AFTER_ATTACK_EFFECT"] = "AFTER_ATTACK_EFFECT";
})(GamePhaseEffects = exports.GamePhaseEffects || (exports.GamePhaseEffects = {}));
var BeginTurnEffect = /** @class */ (function () {
    function BeginTurnEffect(player) {
        this.type = GamePhaseEffects.BEGIN_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return BeginTurnEffect;
}());
exports.BeginTurnEffect = BeginTurnEffect;
var DrewTopdeckEffect = /** @class */ (function () {
    function DrewTopdeckEffect(player, handCard) {
        this.type = GamePhaseEffects.DREW_TOPDECK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.handCard = handCard;
    }
    return DrewTopdeckEffect;
}());
exports.DrewTopdeckEffect = DrewTopdeckEffect;
var ChooseStartingPokemonEffect = /** @class */ (function () {
    function ChooseStartingPokemonEffect(player) {
        this.type = GamePhaseEffects.CHOOSE_STARTING_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return ChooseStartingPokemonEffect;
}());
exports.ChooseStartingPokemonEffect = ChooseStartingPokemonEffect;
var AfterAttackEffect = /** @class */ (function () {
    function AfterAttackEffect(player) {
        this.type = GamePhaseEffects.AFTER_ATTACK_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return AfterAttackEffect;
}());
exports.AfterAttackEffect = AfterAttackEffect;
var ChoosePrizeEffect = /** @class */ (function () {
    function ChoosePrizeEffect(player) {
        this.type = GamePhaseEffects.CHOOSE_PRIZE_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return ChoosePrizeEffect;
}());
exports.ChoosePrizeEffect = ChoosePrizeEffect;
var EndTurnEffect = /** @class */ (function () {
    function EndTurnEffect(player) {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return EndTurnEffect;
}());
exports.EndTurnEffect = EndTurnEffect;
var WhoBeginsEffect = /** @class */ (function () {
    function WhoBeginsEffect() {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
    }
    return WhoBeginsEffect;
}());
exports.WhoBeginsEffect = WhoBeginsEffect;
var BetweenTurnsEffect = /** @class */ (function () {
    function BetweenTurnsEffect(player) {
        this.type = GamePhaseEffects.BETWEEN_TURNS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.poisonDamage = player.active.poisonDamage;
        this.burnDamage = player.active.burnDamage;
        this.flipsForSleep = undefined;
        this.burnFlipResult = undefined;
        this.asleepFlipResult = undefined;
    }
    return BetweenTurnsEffect;
}());
exports.BetweenTurnsEffect = BetweenTurnsEffect;
