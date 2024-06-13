export var PlayCardEffects;
(function (PlayCardEffects) {
    PlayCardEffects["ATTACH_ENERGY_EFFECT"] = "ATTACH_ENERGY_EFFECT";
    PlayCardEffects["PLAY_POKEMON_EFFECT"] = "PLAY_POKEMON_EFFECT";
    PlayCardEffects["PLAY_SUPPORTER_EFFECT"] = "PLAY_SUPPORTER_EFFECT";
    PlayCardEffects["PLAY_STADIUM_EFFECT"] = "PLAY_STADIUM_EFFECT";
    PlayCardEffects["PLAY_POKEMON_TOOL_EFFECT"] = "PLAY_POKEMON_TOOL_EFFECT";
    PlayCardEffects["PLAY_ITEM_EFFECT"] = "PLAY_ITEM_EFFECT";
    PlayCardEffects["TRAINER_EFFECT"] = "TRAINER_EFFECT";
    PlayCardEffects["ENERGY_EFFECT"] = "ENERGY_EFFECT";
    PlayCardEffects["TOOL_EFFECT"] = "TOOL_EFFECT";
})(PlayCardEffects || (PlayCardEffects = {}));
export class AttachEnergyEffect {
    constructor(player, energyCard, target) {
        this.type = PlayCardEffects.ATTACH_ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.energyCard = energyCard;
        this.target = target;
    }
}
export class PlayPokemonEffect {
    constructor(player, pokemonCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.pokemonCard = pokemonCard;
        this.target = target;
    }
}
export class PlaySupporterEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
export class PlayStadiumEffect {
    constructor(player, trainerCard) {
        this.type = PlayCardEffects.PLAY_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
    }
}
export class AttachPokemonToolEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
export class PlayItemEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_ITEM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
export class TrainerEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.TRAINER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
export class EnergyEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
export class ToolEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
