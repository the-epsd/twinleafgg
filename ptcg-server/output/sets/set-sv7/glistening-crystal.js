"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlisteningCrystal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GlisteningCrystal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.regulationMark = 'H';
        this.name = 'Glistening Crystal';
        this.fullName = 'Glistening Crystal SV7';
        this.text = 'Attacks of the Terastal Pokémon this card is attached to cost 1 Energy less of any type.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const attackCost = effect.attack.cost;
            if ((_a = player.active.tool) === null || _a === void 0 ? void 0 : _a.cards.cards.includes(this)) {
                // Remove 1 of any energy type from the attack cost
                const energyIndex = attackCost.findIndex(c => c === card_types_1.CardType.COLORLESS || c === card_types_1.CardType.FIGHTING || c === card_types_1.CardType.PSYCHIC || c === card_types_1.CardType.LIGHTNING || c === card_types_1.CardType.FIRE || c === card_types_1.CardType.WATER || c === card_types_1.CardType.GRASS);
                if (energyIndex !== -1) {
                    attackCost.splice(energyIndex, 1);
                }
            }
        }
        return state;
    }
}
exports.GlisteningCrystal = GlisteningCrystal;
