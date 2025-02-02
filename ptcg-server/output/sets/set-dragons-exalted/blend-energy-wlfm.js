"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlendEnergyWLFM = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BlendEnergyWLFM extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Blend Energy WLFM';
        this.fullName = 'Blend Energy WLFM DRX';
        this.text = 'This card provides [C] Energy. When attached to a Pokémon, this card provides [W], [L], [F], or [M] but only 1 Energy at a time.';
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
            // Instead of guessing whether we provide [W] or [L] or [F] or [M],
            // just push a placeholder so 'checkEnoughEnergy' can decide the best match.
            effect.energyMap.push({
                card: this,
                // Put a single "WLFM" token to indicate this card can fulfill one of [W,L,F,M].
                provides: [card_types_1.CardType.WLFM]
            });
        }
        return state;
    }
}
exports.BlendEnergyWLFM = BlendEnergyWLFM;
