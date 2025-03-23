"use strict";
exports.__esModule = true;
exports.playPokemonReducer = void 0;
var play_card_effects_1 = require("../effects/play-card-effects");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var card_types_1 = require("../card/card-types");
var check_effects_1 = require("../effects/check-effects");
var game_effects_1 = require("../effects/game-effects");
function playPokemonReducer(store, state, effect) {
    /* Play pokemon card */
    if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
        var stage = effect.pokemonCard.stage;
        var isBasic = stage === card_types_1.Stage.BASIC;
        if (isBasic && effect.target.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
                name: effect.player.name,
                card: effect.pokemonCard.name
            });
            effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
            effect.target.pokemonPlayedTurn = state.turn;
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            return state;
        }
        var player = effect.player;
        var isEvolved = stage === card_types_1.Stage.STAGE_1 || card_types_1.Stage.STAGE_2;
        var evolvesFrom = effect.pokemonCard.evolvesFrom;
        var pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) {
            var playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(effect.player, effect.target);
            store.reduceEffect(state, playedTurnEffect);
            if (state.turn == 0 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (state.turn == 1 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (state.turn == 2 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (playedTurnEffect.pokemonPlayedTurn >= state.turn) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN);
            }
            var evolveEffect = new game_effects_1.EvolveEffect(effect.player, effect.target, effect.pokemonCard);
            store.reduceEffect(state, evolveEffect);
            // effect.pokemonCard.marker.markers = [];
            // effect.player.removePokemonEffects(effect.target);
            effect.target.specialConditions = [];
            effect.target.marker.markers = [];
            effect.target.marker.markers = [];
            effect.target.marker.markers = [];
            if (effect.target.specialConditions.includes(card_types_1.SpecialCondition.ABILITY_USED)) {
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            }
            if (effect.target.boardEffect.includes(card_types_1.BoardEffect.ABILITY_USED)) {
                effect.target.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
            }
            return state;
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
    }
    return state;
}
exports.playPokemonReducer = playPokemonReducer;
