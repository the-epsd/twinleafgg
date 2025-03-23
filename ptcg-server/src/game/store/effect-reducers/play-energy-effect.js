"use strict";
exports.__esModule = true;
exports.playEnergyReducer = void 0;
var play_card_effects_1 = require("../effects/play-card-effects");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
function playEnergyReducer(store, state, effect) {
    /* Play energy card */
    if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
        var pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_ATTACHES_CARD, {
            name: effect.player.name,
            card: effect.energyCard.name,
            pokemon: pokemonCard.name
        });
        effect.player.hand.moveCardTo(effect.energyCard, effect.target);
        return state;
    }
    return state;
}
exports.playEnergyReducer = playEnergyReducer;
