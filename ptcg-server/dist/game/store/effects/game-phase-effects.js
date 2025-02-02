export var GamePhaseEffects;
(function (GamePhaseEffects) {
    GamePhaseEffects["BEGIN_TURN_EFFECT"] = "BEGIN_TURN_EFFECT";
    GamePhaseEffects["END_TURN_EFFECT"] = "END_TURN_EFFECT";
    GamePhaseEffects["WHO_BEGINS_EFFECT"] = "WHO_BEGINS_EFFECT";
    GamePhaseEffects["BETWEEN_TURNS_EFFECT"] = "BETWEEN_TURNS_EFFECT";
    GamePhaseEffects["CHOOSE_STARTING_POKEMON_EFFECT"] = "CHOOSE_STARTING_POKEMON_EFFECT";
    GamePhaseEffects["DREW_TOPDECK_EFFECT"] = "DREW_TOPDECK_EFFECT";
})(GamePhaseEffects || (GamePhaseEffects = {}));
export class BeginTurnEffect {
    constructor(player) {
        this.type = GamePhaseEffects.BEGIN_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
export class DrewTopdeckEffect {
    constructor(player, handCard) {
        this.type = GamePhaseEffects.DREW_TOPDECK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.handCard = handCard;
    }
}
export class ChooseStartingPokemonEffect {
    constructor(player) {
        this.type = GamePhaseEffects.CHOOSE_STARTING_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
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
