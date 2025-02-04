"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class BeginTurnEffect {
    constructor(player) {
        this.type = GamePhaseEffects.BEGIN_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.BeginTurnEffect = BeginTurnEffect;
class DrewTopdeckEffect {
    constructor(player, handCard) {
        this.type = GamePhaseEffects.DREW_TOPDECK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.handCard = handCard;
    }
}
exports.DrewTopdeckEffect = DrewTopdeckEffect;
class ChooseStartingPokemonEffect {
    constructor(player) {
        this.type = GamePhaseEffects.CHOOSE_STARTING_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.ChooseStartingPokemonEffect = ChooseStartingPokemonEffect;
class AfterAttackEffect {
    constructor(player) {
        this.type = GamePhaseEffects.AFTER_ATTACK_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.AfterAttackEffect = AfterAttackEffect;
class ChoosePrizeEffect {
    constructor(player) {
        this.type = GamePhaseEffects.CHOOSE_PRIZE_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.ChoosePrizeEffect = ChoosePrizeEffect;
class EndTurnEffect {
    constructor(player) {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.EndTurnEffect = EndTurnEffect;
class WhoBeginsEffect {
    constructor() {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
    }
}
exports.WhoBeginsEffect = WhoBeginsEffect;
class BetweenTurnsEffect {
    constructor(player) {
        this.type = GamePhaseEffects.BETWEEN_TURNS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.poisonDamage = player.active.poisonDamage;
        this.burnDamage = player.active.burnDamage;
        this.flipsForSleep = undefined;
        this.burnFlipResult = undefined;
        this.asleepFlipResult = undefined;
    }
}
exports.BetweenTurnsEffect = BetweenTurnsEffect;
