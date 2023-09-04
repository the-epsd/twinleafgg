"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleTurboEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DoubleTurboEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BRS';
        this.name = 'Double Turbo Energy';
        this.fullName = 'Double Turbo Energy BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active) {
                return state;
            }
            effect.damage -= 20;
        }
        return state;
    }
}
exports.DoubleTurboEnergy = DoubleTurboEnergy;
