"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyGRPD = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BlendEnergyGRPD extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Blend Energy GRPD';
        this.fullName = 'Blend Energy GRPD DRX';
        this.text = 'This card provides [C] Energy. When this card is attached to a Pokémon, this card provides [G], [R], [P], or [D] Energy but provides only 1 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                // Always add the base "EnergyEffect"
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // Explicitly list all the energy types this card can provide
            // This allows the checkEnoughEnergy function to pick the most appropriate type
            // based on the attack cost
            effect.energyMap.push({
                card: this,
                provides: [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK]
            });
        }
        return state;
    }
}
exports.BlendEnergyGRPD = BlendEnergyGRPD;
