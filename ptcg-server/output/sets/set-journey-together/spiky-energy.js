"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpikyEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SpikyEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [C];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Spiky Energy';
        this.fullName = 'Spiky Energy JTG';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy. \n' +
            'If the Pokémon this card is attached to is in the Active Spot and is damaged by an attack ' +
            'from your opponent\'s Pokémon (even if it is Knocked Out), put 2 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this) && state.phase === state_1.GamePhase.ATTACK) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = effect.player;
            if (player === opponent || player.active !== effect.target)
                return state;
            effect.source.damage += 20;
        }
        return state;
    }
}
exports.SpikyEnergy = SpikyEnergy;
