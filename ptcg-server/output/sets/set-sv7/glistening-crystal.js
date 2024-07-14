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
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.tool === this) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
                store.reduceEffect(state, checkEnergy);
                const availableEnergy = checkEnergy.energyMap.flatMap(e => e.provides);
                effect.cost = effect.cost.filter(costType => costType === card_types_1.CardType.NONE || availableEnergy.includes(costType));
            }
        }
        return state;
    }
}
exports.GlisteningCrystal = GlisteningCrystal;
