"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyWLFM = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BlendEnergyWLFM extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Blend Energy WLFM';
        this.fullName = 'Blend Energy WLFM DRX';
        this.text = 'This card provides C Energy. When this card is attached to a Pokémon, this card provides W, L, F, or M Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const pokemon = effect.source;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = pokemon.getPokemonCard();
            const attackCosts = pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.attacks.map(attack => attack.cost);
            const existingEnergy = pokemon.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            const needWater = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.WATER) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.WATER)));
            const needLightning = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.LIGHTNING) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.LIGHTNING)));
            const needFighting = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.FIGHTING) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.FIGHTING)));
            const needMetal = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.METAL) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.METAL)));
            const provides = [];
            if (needWater)
                provides.push(card_types_1.CardType.WATER);
            if (needLightning)
                provides.push(card_types_1.CardType.LIGHTNING);
            if (needFighting)
                provides.push(card_types_1.CardType.FIGHTING);
            if (needMetal)
                provides.push(card_types_1.CardType.METAL);
            if (provides.length > 0) {
                effect.energyMap.push({ card: this, provides });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            console.log('Blend Energy GRPD is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
        }
        return state;
    }
}
exports.BlendEnergyWLFM = BlendEnergyWLFM;
