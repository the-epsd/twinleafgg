"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetweenTurnsEffect = exports.WhoBeginsEffect = exports.EndTurnEffect = exports.GamePhaseEffects = void 0;
var GamePhaseEffects;
(function (GamePhaseEffects) {
    GamePhaseEffects["END_TURN_EFFECT"] = "END_TURN_EFFECT";
    GamePhaseEffects["WHO_BEGINS_EFFECT"] = "WHO_BEGINS_EFFECT";
    GamePhaseEffects["BETWEEN_TURNS_EFFECT"] = "BETWEEN_TURNS_EFFECT";
})(GamePhaseEffects = exports.GamePhaseEffects || (exports.GamePhaseEffects = {}));
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
        this.burnFlipResult = undefined;
        this.asleepFlipResult = undefined;
    }
}
exports.BetweenTurnsEffect = BetweenTurnsEffect;
