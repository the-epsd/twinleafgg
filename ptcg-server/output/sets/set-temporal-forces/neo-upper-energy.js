"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoUpperEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class NeoUpperEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Neo Upper Energy';
        this.fullName = 'Neo Upper Energy TEF';
        this.text = 'As long as this card is attached to a Pokémon, it provides C Energy.' +
            '' +
            'If this card is attached to a Stage 2 Pokémon, this card provides every type of Energy but provides only 2 Energy at a time instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source.getPokemonCard();
            if (pokemon && pokemon.stage == card_types_1.Stage.STAGE_2) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            return state;
        }
        return state;
    }
}
exports.NeoUpperEnergy = NeoUpperEnergy;
