"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedLightningEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SpeedLightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.name = 'Speed Lightning Energy';
        this.fullName = 'Speed Lightning Energy RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.text = 'As long as this card is attached to a Pokémon, it provides [L] Energy. When you attach this card from your hand to a [L] Pokémon, draw 2 cards.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.LIGHTNING] });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.LIGHTNING) {
                player.deck.moveTo(player.hand, 2);
            }
        }
        return state;
    }
}
exports.SpeedLightningEnergy = SpeedLightningEnergy;
