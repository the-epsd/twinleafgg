"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyGRPD = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BlendEnergyGRPD extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Blend Energy GRPD';
        this.fullName = 'Blend Energy GRPD DRX';
        this.text = 'This card provides [C] Energy. When this card is attached to a Pokémon, this card provides [G], [R], [P], or [D] Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            const pokemonCard = pokemon.getPokemonCard();
            const attackCosts = pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.attacks.map(attack => attack.cost);
            const costs = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.flat().filter(t => t !== card_types_1.CardType.COLORLESS)) || [];
            const alreadyProvided = effect.energyMap.flatMap(e => e.provides);
            const neededType = costs.find(cost => this.blendedEnergies.includes(cost) &&
                !alreadyProvided.includes(cost));
            effect.energyMap.push({
                card: this,
                provides: neededType ? [neededType] : [card_types_1.CardType.COLORLESS]
            });
        }
        return state;
    }
}
exports.BlendEnergyGRPD = BlendEnergyGRPD;
