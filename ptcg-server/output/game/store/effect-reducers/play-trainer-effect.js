"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playTrainerReducer = void 0;
const play_card_effects_1 = require("../effects/play-card-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const state_utils_1 = require("../state-utils");
const card_types_1 = require("../card/card-types");
function playTrainerReducer(store, state, effect) {
    /* Play supporter card */
    if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
        const player = effect.player;
        const playTrainer = new play_card_effects_1.TrainerEffect(effect.player, effect.trainerCard, effect.target);
        state = store.reduceEffect(state, playTrainer);
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_SUPPORTER, {
            name: effect.player.name,
            card: effect.trainerCard.name
        });
        player.supporterTurn += 1;
        return state;
    }
    /* Play stadium card */
    if (effect instanceof play_card_effects_1.PlayStadiumEffect) {
        const player = effect.player;
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        if (player.stadium.cards.length > 0) {
            player.stadium.moveTo(player.discard);
        }
        if (opponent.stadium.cards.length > 0) {
            opponent.stadium.moveTo(opponent.discard);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_STADIUM, {
            name: effect.player.name,
            card: effect.trainerCard.name
        });
        player.stadiumUsedTurn = 0;
        player.hand.moveCardTo(effect.trainerCard, player.stadium);
        return state;
    }
    // Play Pokemon Tool card
    if (effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (effect.target.tool !== undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.POKEMON_TOOL_ALREADY_ATTACHED);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_TOOL, {
            name: effect.player.name,
            card: effect.trainerCard.name,
            pokemon: pokemonCard.name
        });
        effect.player.hand.moveCardTo(effect.trainerCard, effect.target);
        effect.target.tool = effect.trainerCard;
        const playTrainer = new play_card_effects_1.TrainerEffect(effect.player, effect.trainerCard, effect.target);
        state = store.reduceEffect(state, playTrainer);
        return state;
    }
    // Play item card
    if (effect instanceof play_card_effects_1.PlayItemEffect) {
        const playTrainer = new play_card_effects_1.TrainerEffect(effect.player, effect.trainerCard, effect.target);
        effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
        state = store.reduceEffect(state, playTrainer);
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_ITEM, {
            name: effect.player.name,
            card: effect.trainerCard.name
        });
        // const player = effect.player;
        // player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    // Process trainer effect
    if (effect instanceof play_card_effects_1.TrainerEffect) {
        if (effect.player.hand.cards.includes(effect.trainerCard)) {
            // IF DIAMOND/PEARL FORMAT, SUPPORTER WILL STAY ON FIELD UNTIL THE END OF YOUR TURN
            const isSupporter = effect.trainerCard.trainerType === card_types_1.TrainerType.SUPPORTER;
            const target = isSupporter ? effect.player.supporter : effect.player.discard;
            effect.player.hand.moveCardTo(effect.trainerCard, target);
            // effect.
            // effect.player.supporter.moveCardTo(effect.trainerCard, effect.player.discard);
        }
        return state;
    }
    return state;
}
exports.playTrainerReducer = playTrainerReducer;
