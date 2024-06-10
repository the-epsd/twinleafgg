"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'Temple of Sinnoh ASR';
        this.text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            // Check if the effect is an attack effect
            if (effect instanceof attack_effects_1.AbstractAttackEffect) {
                // Check if the attacking Pokémon has any Special Energy attached
                if (effect.source.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    // Prevent the attack effect
                    effect.preventDefault = true;
                }
            }
            // Check if the effect is an attach energy effect
            if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
                // Check if the energy being attached is a Special Energy
                if (effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    // Prevent the attach energy effect
                    const player = effect.player;
                    player.specialEnergyBlocked = true;
                }
            }
        }
        // Check if the effect is an attach energy effect
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // Check if the energy being attached is a Special Energy
            if (effect.type.includes(card_types_1.EnergyType.SPECIAL.toString())) {
                // Prevent the attach energy effect
                const player = effect.player;
                player.specialEnergyBlocked = true;
            }
        }
        // Check if the effect is an attach energy effect
        if (effect instanceof game_effects_1.KnockOutAttackEffect) {
            // Check if the energy being attached is a Special Energy
            if (effect.type.includes(card_types_1.EnergyType.SPECIAL.toString())) {
                // Prevent the attach energy effect
                const player = effect.player;
                player.specialEnergyBlocked = true;
            }
        }
        // Check if the effect is an attach energy effect
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            // Check if the energy being provided is a Special Energy
            if (effect.type.includes(card_types_1.EnergyType.SPECIAL.toString())) {
                // Prevent the attach energy effect
                const player = effect.player;
                player.specialEnergyBlocked = true;
            }
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
