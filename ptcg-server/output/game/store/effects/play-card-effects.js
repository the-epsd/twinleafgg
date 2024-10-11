"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscardToHandEffect = exports.TrainerToDeckEffect = exports.CoinFlipEffect = exports.SupporterEffect = exports.ToolEffect = exports.EnergyEffect = exports.TrainerEffect = exports.PlayItemEffect = exports.AttachPokemonToolEffect = exports.PlayStadiumEffect = exports.PlaySupporterEffect = exports.PlayPokemonEffect = exports.AttachEnergyEffect = exports.PlayCardEffects = void 0;
var PlayCardEffects;
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
    PlayCardEffects["SUPPORTER_EFFECT"] = "SUPPORTER_EFFECT";
    PlayCardEffects["COIN_FLIP_EFFECT"] = "COIN_FLIP_EFFECT";
    PlayCardEffects["TRAINER_CARD_TO_DECK_EFFECT"] = "TRAINER_CARD_TO_DECK_EFFECT";
    PlayCardEffects["DISCARD_TO_HAND_EFFECT"] = "DISCARD_TO_HAND_EFFECT";
})(PlayCardEffects = exports.PlayCardEffects || (exports.PlayCardEffects = {}));
class AttachEnergyEffect {
    constructor(player, energyCard, target) {
        this.type = PlayCardEffects.ATTACH_ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.energyCard = energyCard;
        this.target = target;
    }
}
exports.AttachEnergyEffect = AttachEnergyEffect;
class PlayPokemonEffect {
    constructor(player, pokemonCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.pokemonCard = pokemonCard;
        this.target = target;
    }
}
exports.PlayPokemonEffect = PlayPokemonEffect;
class PlaySupporterEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
exports.PlaySupporterEffect = PlaySupporterEffect;
class PlayStadiumEffect {
    constructor(player, trainerCard) {
        this.type = PlayCardEffects.PLAY_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
    }
}
exports.PlayStadiumEffect = PlayStadiumEffect;
class AttachPokemonToolEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
exports.AttachPokemonToolEffect = AttachPokemonToolEffect;
class PlayItemEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_ITEM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
exports.PlayItemEffect = PlayItemEffect;
class TrainerEffect {
    constructor(player, trainerCard, target) {
        this.type = PlayCardEffects.TRAINER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
}
exports.TrainerEffect = TrainerEffect;
class EnergyEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
exports.EnergyEffect = EnergyEffect;
class ToolEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
exports.ToolEffect = ToolEffect;
class SupporterEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.SUPPORTER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
exports.SupporterEffect = SupporterEffect;
class CoinFlipEffect {
    constructor(player) {
        this.type = PlayCardEffects.COIN_FLIP_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
exports.CoinFlipEffect = CoinFlipEffect;
class TrainerToDeckEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.TRAINER_CARD_TO_DECK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
exports.TrainerToDeckEffect = TrainerToDeckEffect;
class DiscardToHandEffect {
    constructor(player, card) {
        this.type = PlayCardEffects.DISCARD_TO_HAND_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
}
exports.DiscardToHandEffect = DiscardToHandEffect;
