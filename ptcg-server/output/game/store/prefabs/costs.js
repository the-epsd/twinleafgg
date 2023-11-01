"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = void 0;
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const __1 = require("../..");
/**
 * These prefabs are for "costs" that effects/attacks must pay.
 */
/**
 *
 * @param state
 * @param effect
 * @param store
 * @param type
 * @param amount
 * @returns
 */
function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, type, amount) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
    return state;
}
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = DISCARD_X_ENERGY_FROM_THIS_POKEMON;
