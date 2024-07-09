"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaknessGuardEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class WeaknessGuardEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'UNM';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Weakness Guard Energy';
        this.fullName = 'Weakness Guard Energy UNM';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'The Pokémon this card is attached to has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.target && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.WeaknessGuardEnergy = WeaknessGuardEnergy;
