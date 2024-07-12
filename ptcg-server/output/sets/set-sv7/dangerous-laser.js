"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DangerousLaser = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DangerousLaser extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.regulationMark = 'H';
        this.name = 'Dangerous Laser';
        this.fullName = 'Dangerous Laser SV6a';
        this.text = 'Your opponent\'s Active Pokémon is now Burned and Confused.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.DangerousLaser = DangerousLaser;
