"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitEnergyFDY = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UnitEnergyFDY extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Unit Energy FDY';
        this.fullName = 'Unit Energy FDY FLI';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'While this card is attached to a Pokémon, it provides [F], [D], and [Y] Energy but provides only 1 Energy at a time.';
        this.blendedEnergies = [card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK, card_types_1.CardType.FAIRY];
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
            const fightingCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.FIGHTING).length, 0)) || 0;
            const darkCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.DARK).length, 0)) || 0;
            const fairyCost = (attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.reduce((sum, cost) => sum + cost.filter(t => t === card_types_1.CardType.FAIRY).length, 0)) || 0;
            const existingFighting = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.FIGHTING).length : 0), 0);
            const existingDark = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.DARK).length : 0), 0);
            const existingFairy = existingEnergy.reduce((sum, e) => sum + (e instanceof energy_card_1.EnergyCard ? e.provides.filter(t => t === card_types_1.CardType.FAIRY).length : 0), 0);
            const needsFighting = fightingCost > existingFighting;
            const needsDark = darkCost > existingDark;
            const needsFairy = fairyCost > existingFairy;
            const provides = [];
            if (needsFighting)
                provides.push(card_types_1.CardType.FIGHTING);
            if (needsDark)
                provides.push(card_types_1.CardType.DARK);
            if (needsFairy)
                provides.push(card_types_1.CardType.FAIRY);
            if (provides.length > 0) {
                effect.energyMap.push({ card: this, provides });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            console.log('Unit Energy FDY is providing:', effect.energyMap[effect.energyMap.length - 1].provides);
        }
        return state;
    }
}
exports.UnitEnergyFDY = UnitEnergyFDY;
