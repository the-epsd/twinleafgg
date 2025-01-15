"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuckyHelmet = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
class LuckyHelmet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Lucky Helmet';
        this.fullName = 'Lucky Helmet TWM';
        this.text = 'If the Pokémon this card is attached to is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if it is Knocked Out), draw 2 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            opponent.deck.moveTo(opponent.hand, 2);
        }
        return state;
    }
}
exports.LuckyHelmet = LuckyHelmet;
