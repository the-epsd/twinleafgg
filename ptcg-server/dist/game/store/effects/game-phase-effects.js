export var GamePhaseEffects;
(function (GamePhaseEffects) {
    GamePhaseEffects["END_TURN_EFFECT"] = "END_TURN_EFFECT";
    GamePhaseEffects["WHO_BEGINS_EFFECT"] = "WHO_BEGINS_EFFECT";
    GamePhaseEffects["BETWEEN_TURNS_EFFECT"] = "BETWEEN_TURNS_EFFECT";
})(GamePhaseEffects || (GamePhaseEffects = {}));
export class EndTurnEffect {
    constructor(player) {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
export class WhoBeginsEffect {
    constructor() {
        this.type = GamePhaseEffects.END_TURN_EFFECT;
        this.preventDefault = false;
    }
}
export class BetweenTurnsEffect {
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
