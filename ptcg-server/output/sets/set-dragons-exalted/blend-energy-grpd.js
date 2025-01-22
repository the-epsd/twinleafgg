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
    // We won't do the "needed cost logic" here anymore
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
            // Instead of guessing whether we provide [G] or [R] or [P] or [D],
            // just push a placeholder so 'checkEnoughEnergy' can decide the best match.
            effect.energyMap.push({
                card: this,
                // Put a single "GRPD" token to indicate this card can fulfill one of [G,R,P,D].
                provides: [card_types_1.CardType.GRPD]
            });
        }
        return state;
    }
}
exports.BlendEnergyGRPD = BlendEnergyGRPD;
