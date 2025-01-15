"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JetEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class JetEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '190';
        this.regulationMark = 'G';
        this.name = 'Jet Energy';
        this.fullName = 'Jet Energy PAL';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
            '' +
            'When you attach this card from your hand to 1 of your Benched Pokémon, switch that Pokémon with your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            const target = effect.target;
            player.switchPokemon(target);
        }
        return state;
    }
}
exports.JetEnergy = JetEnergy;
