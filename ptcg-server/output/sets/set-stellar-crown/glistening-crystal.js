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
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.regulationMark = 'H';
        this.name = 'Sparkling Crystal';
        this.fullName = 'Glistening Crystal SCR';
        this.text = 'When the Tera Pokémon this card is attached to uses an attack, that attack costs 1 Energy less. (The Energy can be of any type.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.tools.includes(this)) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
                store.reduceEffect(state, checkEnergy);
                const availableEnergy = checkEnergy.energyMap.flatMap(e => e.provides);
                if (effect.cost.length > 0) {
                    let removed = false;
                    for (const costType of effect.cost) {
                        if (availableEnergy.includes(costType)) {
                            effect.cost = effect.cost.filter((type, index) => type !== costType || (type === costType && effect.cost.indexOf(type) !== index));
                            removed = true;
                            break;
                        }
                    }
                    if (!removed) {
                        effect.cost = effect.cost.filter((type, index) => type !== effect.cost[0] || (type === effect.cost[0] && effect.cost.indexOf(type) !== index));
                    }
                }
            }
        }
        return state;
    }
}
exports.GlisteningCrystal = GlisteningCrystal;
