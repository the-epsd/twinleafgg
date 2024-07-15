"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleTurboEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DoubleTurboEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.regulationMark = 'F';
        this.name = 'Double Turbo Energy';
        this.fullName = 'Double Turbo Energy BRS';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C][C] Energy.' +
            '' +
            'The attacks of the Pokémon this card is attached to do 20 less damage to your opponent\'s Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof attack_effects_1.DealDamageEffect) && effect.source.cards.includes(this)) {
            const player = effect.player;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // Apply damage reduction and increase the energy provided only if EnergyEffect is successful
            effect.damage -= 20;
        }
        return state;
    }
}
exports.DoubleTurboEnergy = DoubleTurboEnergy;
