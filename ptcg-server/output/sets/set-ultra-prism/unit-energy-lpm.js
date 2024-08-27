"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitEnergyLPM = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UnitEnergyLPM extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Unit Energy LPM';
        this.fullName = 'Unit Energy LPM UPR';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'While this card is attached to a Pokémon, it provides [L], [P], and [M] Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL];
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
            const lightningCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.LIGHTNING).length, 0)) || 0;
            const psychicCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.PSYCHIC).length, 0)) || 0;
            const metalCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.METAL).length, 0)) || 0;
            const existingLightning = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.LIGHTNING).length : 0), 0);
            const existingPsychic = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.PSYCHIC).length : 0), 0);
            const existingMetal = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.METAL).length : 0), 0);
            const needsLightning = lightningCost > existingLightning;
            const needsPsychic = psychicCost > existingPsychic;
            const needsMetal = metalCost > existingMetal;
            const provides = [];
            if (needsLightning)
                provides.push(card_types_1.CardType.LIGHTNING);
            if (needsPsychic)
                provides.push(card_types_1.CardType.PSYCHIC);
            if (needsMetal)
                provides.push(card_types_1.CardType.METAL);
            if (provides.length > 0) {
                effect.energyMap.push({ card: this, provides });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            console.log('Unit Energy LPM is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
        }
        return state;
    }
}
exports.UnitEnergyLPM = UnitEnergyLPM;
