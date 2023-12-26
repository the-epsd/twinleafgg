"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockyHelmet = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class RockyHelmet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '193';
        this.name = 'Rocky Helmet';
        this.fullName = 'Rocky Helmet SVI';
        this.text = 'If the Pokemon this card is attached to is your Active Pokemon and is ' +
            'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
            'put 2 damage counters on the Attacking Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.source.damage += 20;
            }
        }
        return state;
    }
}
exports.RockyHelmet = RockyHelmet;
