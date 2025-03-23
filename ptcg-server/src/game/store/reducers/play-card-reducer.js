"use strict";
exports.__esModule = true;
exports.playCardReducer = void 0;
var play_card_effects_1 = require("../effects/play-card-effects");
var energy_card_1 = require("../card/energy-card");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var play_card_action_1 = require("../actions/play-card-action");
var pokemon_card_1 = require("../card/pokemon-card");
var pokemon_card_list_1 = require("../state/pokemon-card-list");
var state_1 = require("../state/state");
var trainer_card_1 = require("../card/trainer-card");
var card_types_1 = require("../card/card-types");
var state_utils_1 = require("../state-utils");
function findCardList(state, target) {
    var player = target.player === play_card_action_1.PlayerType.BOTTOM_PLAYER
        ? state.players[state.activePlayer]
        : state.players[state.activePlayer ? 0 : 1];
    switch (target.slot) {
        case play_card_action_1.SlotType.ACTIVE:
            return player.active;
        case play_card_action_1.SlotType.BENCH:
            return player.bench[target.index];
    }
}
function playCardReducer(store, state, action) {
    var player = state.players[state.activePlayer];
    if (state.phase === state_1.GamePhase.PLAYER_TURN) {
        if (action instanceof play_card_action_1.PlayCardAction) {
            if (player === undefined || player.id !== action.id) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var handCard = player.hand.cards[action.handIndex];
            if (handCard === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_CARD);
            }
            if (handCard instanceof energy_card_1.EnergyCard) {
                var target = findCardList(state, action.target);
                if (!(target instanceof pokemon_card_list_1.PokemonCardList) || target.cards.length === 0) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                }
                if (player.usedDragonsWish === true || state.rules.unlimitedEnergyAttachments === true) {
                    // Allow multiple energy attachments per turn
                    var effect = new play_card_effects_1.AttachEnergyEffect(player, handCard, target);
                    return store.reduceEffect(state, effect);
                }
                else {
                    if (player.energyPlayedTurn === state.turn) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.ENERGY_ALREADY_ATTACHED);
                    }
                    player.energyPlayedTurn = state.turn;
                    var effect = new play_card_effects_1.AttachEnergyEffect(player, handCard, target);
                    return store.reduceEffect(state, effect);
                }
            }
            if (handCard instanceof pokemon_card_1.PokemonCard) {
                var target = findCardList(state, action.target);
                if (!(target instanceof pokemon_card_list_1.PokemonCardList)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                }
                var effect = new play_card_effects_1.PlayPokemonEffect(player, handCard, target);
                return store.reduceEffect(state, effect);
            }
            if (handCard instanceof trainer_card_1.TrainerCard) {
                var target = findCardList(state, action.target);
                var effect = void 0;
                switch (handCard.trainerType) {
                    case card_types_1.TrainerType.SUPPORTER:
                        if (state.turn === 1 && handCard.firstTurn !== true) {
                            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        if (player.supporter.cards.length > 0) {
                            throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
                        }
                        effect = new play_card_effects_1.PlaySupporterEffect(player, handCard, target);
                        break;
                    case card_types_1.TrainerType.STADIUM: {
                        if (player.stadiumPlayedTurn === state.turn) {
                            throw new game_error_1.GameError(game_message_1.GameMessage.STADIUM_ALREADY_PLAYED);
                        }
                        var stadium = state_utils_1.StateUtils.getStadiumCard(state);
                        if (stadium && stadium.name === handCard.name) {
                            throw new game_error_1.GameError(game_message_1.GameMessage.SAME_STADIUM_ALREADY_IN_PLAY);
                        }
                        player.stadiumPlayedTurn = state.turn;
                        effect = new play_card_effects_1.PlayStadiumEffect(player, handCard);
                        break;
                    }
                    case card_types_1.TrainerType.TOOL:
                        if (!(target instanceof pokemon_card_list_1.PokemonCardList)) {
                            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                        }
                        effect = new play_card_effects_1.AttachPokemonToolEffect(player, handCard, target);
                        break;
                    default:
                        effect = new play_card_effects_1.PlayItemEffect(player, handCard, target);
                        break;
                }
                return store.reduceEffect(state, effect);
            }
            player.hand.moveCardTo(handCard, player.supporter);
        }
    }
    return state;
}
exports.playCardReducer = playCardReducer;
