"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.playerTurnReducer = void 0;
var game_actions_1 = require("../actions/game-actions");
var state_1 = require("../state/state");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var game_effects_1 = require("../effects/game-effects");
var game_phase_effects_1 = require("../effects/game-phase-effects");
var state_utils_1 = require("../state-utils");
var play_card_action_1 = require("../actions/play-card-action");
var pokemon_card_1 = require("../card/pokemon-card");
var check_effects_1 = require("../effects/check-effects");
var trainer_card_1 = require("../card/trainer-card");
function playerTurnReducer(store, state, action) {
    if (state.phase === state_1.GamePhase.PLAYER_TURN) {
        if (action instanceof game_actions_1.PassTurnAction) {
            var player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            state = store.reduceEffect(state, endTurnEffect);
            return state;
        }
        if (action instanceof game_actions_1.RetreatAction) {
            var player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var retreatEffect = new game_effects_1.RetreatEffect(player, action.benchIndex);
            state = store.reduceEffect(state, retreatEffect);
            player.active.clearEffects();
            return state;
        }
        if (action instanceof game_actions_1.AttackAction) {
            var player_1 = state.players[state.activePlayer];
            if (player_1 === undefined || player_1.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var pokemonCard = player_1.active.getPokemonCard();
            var attacks_1 = [];
            if (pokemonCard) {
                attacks_1 = __spreadArray([], pokemonCard.attacks);
            }
            // Add bench attacks
            player_1.bench.forEach(function (benchSlot) {
                var benchPokemon = benchSlot.getPokemonCard();
                if (benchPokemon && benchPokemon.attacks.some(function (attack) { return attack.useOnBench; })) {
                    var benchAttacks = benchPokemon.attacks.filter(function (attack) { return attack.useOnBench; });
                    attacks_1.push.apply(attacks_1, benchAttacks);
                    var attackEffect_1 = new check_effects_1.CheckPokemonAttacksEffect(player_1);
                    state = store.reduceEffect(state, attackEffect_1);
                    attacks_1 = __spreadArray(__spreadArray([], attacks_1), attackEffect_1.attacks);
                }
            });
            var attackEffect = new check_effects_1.CheckPokemonAttacksEffect(player_1);
            state = store.reduceEffect(state, attackEffect);
            attacks_1 = __spreadArray(__spreadArray([], attacks_1), attackEffect.attacks);
            var attack = attacks_1.find(function (a) { return a.name === action.name; });
            if (attack === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_ATTACK);
            }
            var useAttackEffect = new game_effects_1.UseAttackEffect(player_1, attack);
            state = store.reduceEffect(state, useAttackEffect);
            state.lastAttack = attack;
            if (!state.playerLastAttack) {
                state.playerLastAttack = {};
            }
            state.playerLastAttack[player_1.id] = attack;
            return state;
        }
        if (action instanceof game_actions_1.UseAbilityAction) {
            var player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var pokemonCard = void 0;
            switch (action.target.slot) {
                case play_card_action_1.SlotType.ACTIVE:
                case play_card_action_1.SlotType.BENCH: {
                    var target = state_utils_1.StateUtils.getTarget(state, player, action.target);
                    pokemonCard = target.getPokemonCard();
                    break;
                }
                case play_card_action_1.SlotType.DISCARD: {
                    var discardCard = player.discard.cards[action.target.index];
                    if (discardCard instanceof pokemon_card_1.PokemonCard) {
                        pokemonCard = discardCard;
                    }
                    break;
                }
                case play_card_action_1.SlotType.HAND: {
                    var handCard = player.hand.cards[action.target.index];
                    if (handCard instanceof pokemon_card_1.PokemonCard) {
                        pokemonCard = handCard;
                    }
                    break;
                }
            }
            if (pokemonCard !== undefined) {
                //throw new GameError(GameMessage.INVALID_TARGET);
                var power = void 0;
                if (action.target.slot === play_card_action_1.SlotType.ACTIVE || action.target.slot === play_card_action_1.SlotType.BENCH) {
                    var target = state_utils_1.StateUtils.getTarget(state, player, action.target);
                    var powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, target);
                    state = store.reduceEffect(state, powersEffect);
                    power = __spreadArray(__spreadArray([], pokemonCard.powers), powersEffect.powers).find(function (a) { return a.name === action.name; });
                }
                else {
                    power = pokemonCard.powers.find(function (a) { return a.name === action.name; });
                }
                if (power === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_POWER);
                }
                var slot = action.target.slot;
                if (slot === play_card_action_1.SlotType.ACTIVE || slot === play_card_action_1.SlotType.BENCH) {
                    if (!power.useWhenInPlay) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                    }
                }
                if (slot === play_card_action_1.SlotType.HAND && !power.useFromHand) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                if (slot === play_card_action_1.SlotType.DISCARD && !power.useFromDiscard) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                state = store.reduceEffect(state, new game_effects_1.UsePowerEffect(player, power, pokemonCard, action.target));
                return state;
            }
        }
        if (action instanceof game_actions_1.UseTrainerAbilityAction) {
            var player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            var trainerCard = void 0;
            var discardCard = player.discard.cards[action.target.index];
            if (discardCard instanceof trainer_card_1.TrainerCard) {
                trainerCard = discardCard;
                if (trainerCard !== undefined) {
                    var power = void 0;
                    if (action.target.slot === play_card_action_1.SlotType.DISCARD) {
                        power = trainerCard.powers.find(function (a) { return a.name === action.name; });
                    }
                    if (power === undefined) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_POWER);
                    }
                    var slot = action.target.slot;
                    if (slot === play_card_action_1.SlotType.DISCARD && !power.useFromDiscard) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                    }
                    state = store.reduceEffect(state, new game_effects_1.UseTrainerPowerEffect(player, power, trainerCard, action.target));
                    return state;
                }
            }
        }
        if (action instanceof game_actions_1.UseStadiumAction) {
            var player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            if (player.stadiumUsedTurn === state.turn) {
                throw new game_error_1.GameError(game_message_1.GameMessage.STADIUM_ALREADY_USED);
            }
            var stadium = state_utils_1.StateUtils.getStadiumCard(state);
            if (stadium === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NO_STADIUM_IN_PLAY);
            }
            state = store.reduceEffect(state, new game_effects_1.UseStadiumEffect(player, stadium));
            return state;
        }
    }
    return state;
}
exports.playerTurnReducer = playerTurnReducer;
