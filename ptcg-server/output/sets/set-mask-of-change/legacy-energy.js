"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyEnergy = void 0;
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LegacyEnergy extends game_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [game_1.CardType.COLORLESS];
        this.energyType = game_1.EnergyType.SPECIAL;
        this.tags = [game_1.CardTag.ACE_SPEC];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.name = 'Legacy Energy';
        this.fullName = 'Legacy Energy PAL';
        this.text = 'If the Pokemon this card is attached to is your Active Pokemon and is ' +
            'damaged by an opponent\'s attack (even if that Pokemon is Knocked Out), ' +
            'put 2 damage counters on the Attacking Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tool === this) {
            //   const player = effect.player;
            //   const targetPlayer = StateUtils.findOwner(state, effect.target);
            //   if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
            //     return state;
            //   }
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.prizeCount -= 1;
            }
        }
        return state;
    }
}
exports.LegacyEnergy = LegacyEnergy;
