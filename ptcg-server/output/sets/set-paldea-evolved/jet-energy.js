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
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            const target = effect.target;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // Switch the active Pokemon only if the EnergyEffect is successful
            player.switchPokemon(target);
            console.log('special energy worked');
        }
        return state;
    }
}
exports.JetEnergy = JetEnergy;
