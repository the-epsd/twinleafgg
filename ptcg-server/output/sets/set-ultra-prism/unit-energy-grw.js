"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitEnergyGRW = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UnitEnergyGRW extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Unit Energy GRW';
        this.fullName = 'Unit Energy GRW UPR';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'While this card is attached to a Pokémon, it provides [G], [R], and [W] Energy but provides only 1 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = effect.source.getPokemonCard();
            const attackCost = pokemonCard && pokemonCard.attacks[0].cost;
            const providedEnergy = [];
            if (attackCost) {
                const attachedEnergy = effect.source.cards.filter(card => card instanceof energy_card_1.EnergyCard);
                const attachedEnergyTypes = new Set(attachedEnergy.flatMap(energy => energy.provides));
                for (const costType of attackCost) {
                    if (!attachedEnergyTypes.has(costType)) {
                        if (costType === card_types_1.CardType.GRASS || costType === card_types_1.CardType.WATER || costType === card_types_1.CardType.FIRE) {
                            providedEnergy.push(costType);
                        }
                    }
                }
            }
            if (providedEnergy.length > 0) {
                effect.energyMap.push({ card: this, provides: providedEnergy });
            }
            return state;
        }
        return state;
    }
}
exports.UnitEnergyGRW = UnitEnergyGRW;
