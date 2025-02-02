"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DrawEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '209';
        this.name = 'Draw Energy';
        this.fullName = 'Draw Energy CEC';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'When you attach this card from your hand to a Pokémon, draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.DrawEnergy = DrawEnergy;
