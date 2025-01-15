"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TwinEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RCL';
        this.name = 'Twin Energy';
        this.fullName = 'Twin Energy RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.text = 'As long as this card is attached to a Pokémon that isn\'t a Pokémon V or a Pokémon-GX, it provides [C][C] Energy.' +
            '' +
            'If this card is attached to a Pokémon V or a Pokémon-GX, it provides [C] Energy instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            if (effect.source.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                effect.source.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_V) ||
                effect.source.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                effect.source.getPokemonCard().tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                return state;
            }
            this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        }
        return state;
    }
}
exports.TwinEnergy = TwinEnergy;
