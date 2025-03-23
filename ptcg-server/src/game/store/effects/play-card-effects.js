"use strict";
exports.__esModule = true;
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
var AttachEnergyEffect = /** @class */ (function () {
    function AttachEnergyEffect(player, energyCard, target) {
        this.type = PlayCardEffects.ATTACH_ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.energyCard = energyCard;
        this.target = target;
    }
    return AttachEnergyEffect;
}());
exports.AttachEnergyEffect = AttachEnergyEffect;
var PlayPokemonEffect = /** @class */ (function () {
    function PlayPokemonEffect(player, pokemonCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.pokemonCard = pokemonCard;
        this.target = target;
    }
    return PlayPokemonEffect;
}());
exports.PlayPokemonEffect = PlayPokemonEffect;
var PlaySupporterEffect = /** @class */ (function () {
    function PlaySupporterEffect(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
    return PlaySupporterEffect;
}());
exports.PlaySupporterEffect = PlaySupporterEffect;
var PlayStadiumEffect = /** @class */ (function () {
    function PlayStadiumEffect(player, trainerCard) {
        this.type = PlayCardEffects.PLAY_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
    }
    return PlayStadiumEffect;
}());
exports.PlayStadiumEffect = PlayStadiumEffect;
var AttachPokemonToolEffect = /** @class */ (function () {
    function AttachPokemonToolEffect(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
    return AttachPokemonToolEffect;
}());
exports.AttachPokemonToolEffect = AttachPokemonToolEffect;
var PlayItemEffect = /** @class */ (function () {
    function PlayItemEffect(player, trainerCard, target) {
        this.type = PlayCardEffects.PLAY_ITEM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
    return PlayItemEffect;
}());
exports.PlayItemEffect = PlayItemEffect;
var TrainerEffect = /** @class */ (function () {
    function TrainerEffect(player, trainerCard, target) {
        this.type = PlayCardEffects.TRAINER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.trainerCard = trainerCard;
        this.target = target;
    }
    return TrainerEffect;
}());
exports.TrainerEffect = TrainerEffect;
var EnergyEffect = /** @class */ (function () {
    function EnergyEffect(player, card) {
        this.type = PlayCardEffects.ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
    return EnergyEffect;
}());
exports.EnergyEffect = EnergyEffect;
var ToolEffect = /** @class */ (function () {
    function ToolEffect(player, card) {
        this.type = PlayCardEffects.TOOL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
    return ToolEffect;
}());
exports.ToolEffect = ToolEffect;
var SupporterEffect = /** @class */ (function () {
    function SupporterEffect(player, card) {
        this.type = PlayCardEffects.SUPPORTER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
    return SupporterEffect;
}());
exports.SupporterEffect = SupporterEffect;
var CoinFlipEffect = /** @class */ (function () {
    function CoinFlipEffect(player) {
        this.type = PlayCardEffects.COIN_FLIP_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
    return CoinFlipEffect;
}());
exports.CoinFlipEffect = CoinFlipEffect;
var TrainerToDeckEffect = /** @class */ (function () {
    function TrainerToDeckEffect(player, card) {
        this.type = PlayCardEffects.TRAINER_CARD_TO_DECK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
    return TrainerToDeckEffect;
}());
exports.TrainerToDeckEffect = TrainerToDeckEffect;
var DiscardToHandEffect = /** @class */ (function () {
    function DiscardToHandEffect(player, card) {
        this.type = PlayCardEffects.DISCARD_TO_HAND_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
    }
    return DiscardToHandEffect;
}());
exports.DiscardToHandEffect = DiscardToHandEffect;
