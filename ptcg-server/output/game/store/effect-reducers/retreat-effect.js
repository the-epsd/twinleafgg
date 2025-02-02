"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retreatReducer = void 0;
const choose_energy_prompt_1 = require("../prompts/choose-energy-prompt");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const game_effects_1 = require("../effects/game-effects");
const state_utils_1 = require("../state-utils");
const check_effects_1 = require("../effects/check-effects");
const card_types_1 = require("../card/card-types");
function retreatPokemon(store, state, effect) {
    const player = effect.player;
    const activePokemon = player.active.getPokemonCard();
    const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
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
    return array.reduce((acc, item) => acc.concat(fn(item)), []);
}
function retreatReducer(store, state, effect) {
    /* Retreat pokemon */
    if (effect instanceof game_effects_1.RetreatEffect) {
        const player = effect.player;
        if (player.bench[effect.benchIndex].cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        const sp = player.active.specialConditions;
        if ((sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) && !effect.ignoreStatusConditions) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
        }
        if (player.retreatedTurn === state.turn) {
            throw new game_error_1.GameError(game_message_1.GameMessage.RETREAT_ALREADY_USED);
        }
        const checkRetreatCost = new check_effects_1.CheckRetreatCostEffect(effect.player);
        state = store.reduceEffect(state, checkRetreatCost);
        if (checkRetreatCost.cost.length === 0) {
            player.active.clearEffects();
            retreatPokemon(store, state, effect);
            return state;
        }
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const enoughEnergies = state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
        if (enoughEnergies === false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
        }
        // If the player has the exact energy cost, automatically discard the energy and retreat
        if (state_utils_1.StateUtils.checkExactEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost)) {
            const cards = flatMap(checkProvidedEnergy.energyMap, e => Array.from({ length: e.provides.length }, () => e.card));
            player.active.clearEffects();
            player.active.moveCardsTo(cards, player.discard);
            retreatPokemon(store, state, effect);
            const activePokemonCard = player.active.getPokemonCard();
            activePokemonCard.movedToActiveThisTurn = true;
            return state;
        }
        return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGY_TO_DISCARD, checkProvidedEnergy.energyMap, checkRetreatCost.cost), energy => {
            if (energy === null) {
                return; // operation cancelled
            }
            const activePokemon = player.active.getPokemonCard();
            const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
            if (activePokemon === undefined || benchedPokemon === undefined) {
                return;
            }
            const cards = energy.map(e => e.card);
            player.active.clearEffects();
            player.active.moveCardsTo(cards, player.discard);
            retreatPokemon(store, state, effect);
            const activePokemonCard = player.active.getPokemonCard();
            activePokemonCard.movedToActiveThisTurn = true;
        });
    }
    return state;
}
exports.retreatReducer = retreatReducer;
