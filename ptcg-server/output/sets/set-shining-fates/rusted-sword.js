"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustedSword = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RustedSword extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.regulationMark = 'D';
        this.name = 'Rusted Sword';
        this.fullName = 'Rusted Sword SHF';
        this.text = 'The attacks of the Zacian V this card is attached to do 30 more damage to your opponent\’s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            // Apply damage increase to only active Pokémon
            if (effect.target !== opponent.active)
                return state;
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.name === 'Zacian V') {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.RustedSword = RustedSword;
