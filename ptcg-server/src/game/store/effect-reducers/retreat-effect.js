"use strict";
exports.__esModule = true;
exports.retreatReducer = void 0;
var choose_energy_prompt_1 = require("../prompts/choose-energy-prompt");
var game_error_1 = require("../../game-error");
var game_message_1 = require("../../game-message");
var game_effects_1 = require("../effects/game-effects");
var state_utils_1 = require("../state-utils");
var check_effects_1 = require("../effects/check-effects");
var card_types_1 = require("../card/card-types");
function retreatPokemon(store, state, effect) {
    var player = effect.player;
    var activePokemon = player.active.getPokemonCard();
    var benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
    if (activePokemon === undefined || benchedPokemon === undefined) {
        return;
    }
    store.log(state, game_message_1.GameLog.LOG_PLAYER_RETREATS, {
        name: player.name,
        active: activePokemon.name,
        benched: benchedPokemon.name
    });
    player.retreatedTurn = state.turn;
    player.switchPokemon(player.bench[effect.benchIndex]);
}
function flatMap(array, fn) {
    return array.reduce(function (acc, item) { return acc.concat(fn(item)); }, []);
}
function retreatReducer(store, state, effect) {
    /* Retreat pokemon */
    if (effect instanceof game_effects_1.RetreatEffect) {
        var player_1 = effect.player;
        if (player_1.bench[effect.benchIndex].cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        var sp = player_1.active.specialConditions;
        if ((sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) && !effect.ignoreStatusConditions) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
        }
        if (player_1.retreatedTurn === state.turn) {
            throw new game_error_1.GameError(game_message_1.GameMessage.RETREAT_ALREADY_USED);
        }
        var checkRetreatCost = new check_effects_1.CheckRetreatCostEffect(effect.player);
        state = store.reduceEffect(state, checkRetreatCost);
        if (checkRetreatCost.cost.length === 0) {
            player_1.active.clearEffects();
            retreatPokemon(store, state, effect);
            return state;
        }
        var checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player_1);
        state = store.reduceEffect(state, checkProvidedEnergy);
        var enoughEnergies = state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
        if (enoughEnergies === false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
        }
        // If the player has the exact energy cost, automatically discard the energy and retreat
        if (state_utils_1.StateUtils.checkExactEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost)) {
            var cards = flatMap(checkProvidedEnergy.energyMap, function (e) { return Array.from({ length: e.provides.length }, function () { return e.card; }); });
            player_1.active.clearEffects();
            player_1.active.moveCardsTo(cards, effect.moveRetreatCostTo);
            retreatPokemon(store, state, effect);
            var activePokemonCard = player_1.active.getPokemonCard();
            activePokemonCard.movedToActiveThisTurn = true;
            return state;
        }
        return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player_1.id, game_message_1.GameMessage.CHOOSE_ENERGY_TO_PAY_RETREAT_COST, checkProvidedEnergy.energyMap, checkRetreatCost.cost), function (energy) {
            if (energy === null) {
                return; // operation cancelled
            }
            var activePokemon = player_1.active.getPokemonCard();
            var benchedPokemon = player_1.bench[effect.benchIndex].getPokemonCard();
            if (activePokemon === undefined || benchedPokemon === undefined) {
                return;
            }
            var cards = energy.map(function (e) { return e.card; });
            player_1.active.clearEffects();
            player_1.active.moveCardsTo(cards, effect.moveRetreatCostTo);
            retreatPokemon(store, state, effect);
            var activePokemonCard = player_1.active.getPokemonCard();
            activePokemonCard.movedToActiveThisTurn = true;
        });
    }
    return state;
}
exports.retreatReducer = retreatReducer;
