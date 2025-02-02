"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainbowEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RainbowEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SUM';
        this.name = 'Rainbow Energy';
        this.fullName = 'Rainbow Energy SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.text = 'This card provides C Energy. While in play, this card provides every ' +
            'type of Energy but provides only 1 Energy at a time. When you attach ' +
            'this card from your hand to 1 of your Pokemon, put 1 damage counter ' +
            'on that Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            effect.target.damage += 10;
        }
        return state;
    }
}
exports.RainbowEnergy = RainbowEnergy;
