"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyGRPD = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
            const needsGrass = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.GRASS) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.GRASS)));
            const needsFire = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.FIRE) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.FIRE)));
            const needsPsychic = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.PSYCHIC) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.PSYCHIC)));
            const needsDark = attackCosts === null || attackCosts === void 0 ? void 0 : attackCosts.some(cost => cost.includes(card_types_1.CardType.DARK) && !existingEnergy.some(e => e instanceof energy_card_1.EnergyCard && e.provides.includes(card_types_1.CardType.DARK)));
            const provides = [];
            if (needsGrass)
                provides.push(card_types_1.CardType.GRASS);
            if (needsFire)
                provides.push(card_types_1.CardType.FIRE);
            if (needsPsychic)
                provides.push(card_types_1.CardType.PSYCHIC);
            if (needsDark)
                provides.push(card_types_1.CardType.DARK);
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
exports.BlendEnergyGRPD = BlendEnergyGRPD;
