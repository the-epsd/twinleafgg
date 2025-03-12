"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlisteningCrystal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
                store.reduceEffect(state, checkEnergy);
                const availableEnergy = [...checkEnergy.energyMap.flatMap(e => e.provides)];
                if (effect.cost.length > 0) {
                    // A list of matched energies.
                    let contained = [];
                    for (const costType of effect.cost) {
                        if (costType == 9 && availableEnergy.length > 0) {
                            contained.push(availableEnergy.splice(0, 1)[0]);
                        }
                        else {
                            let i = availableEnergy.indexOf(costType);
                            if (i > -1) {
                                //Remove from the available pool and add to the contained energy pool
                                contained.push(availableEnergy.splice(i, 1)[0]);
                            }
                        }
                    }
                    //If the contained pool is met or one less than the cost, then it's good.
                    if (contained.length >= effect.cost.length - 1) {
                        effect.cost = contained;
                    }
                }
            }
        }
        return state;
    }
}
exports.GlisteningCrystal = GlisteningCrystal;
