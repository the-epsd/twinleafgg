"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RichEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.name = 'Enriching Energy';
        this.fullName = 'Rich Energy SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.text = 'When this card is attached to a Pokémon, it provides 1 [C] Energy.' +
            '' +
            'When you attach this card from your hand to one of your Pokémon, draw 4 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 4);
        }
        return state;
    }
}
exports.RichEnergy = RichEnergy;
