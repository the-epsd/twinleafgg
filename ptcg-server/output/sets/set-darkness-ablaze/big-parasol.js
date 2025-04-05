"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigParasol = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class BigParasol extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DAA';
        this.name = 'Big Parasol';
        this.fullName = 'Big Parasol DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.text = 'As long as the Pokémon this card is attached to is in the Active Spot, prevent all effects of attacks from your opponent\'s Pokémon done to all of your Pokémon. (Existing effects are not removed. Damage is not an effect.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (player.active.tool === this && !prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
                const sourceCard = effect.source.getPokemonCard();
                if (sourceCard) {
                    // Check if the effect targets the player's active or benched Pokémon
                    const isTargetingActive = effect.target === player.active;
                    const isTargetingBench = player.bench.includes(effect.target);
                    if (isTargetingActive || isTargetingBench) {
                        // Allow Weakness & Resistance           NOT WORKING???
                        if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                            return state;
                        }
                        // Allow damage
                        if (effect instanceof attack_effects_1.PutDamageEffect) {
                            return state;
                        }
                        // Allow damage
                        if (effect instanceof attack_effects_1.DealDamageEffect) {
                            return state;
                        }
                        effect.preventDefault = true;
                    }
                }
            }
        }
        return state;
    }
}
exports.BigParasol = BigParasol;
