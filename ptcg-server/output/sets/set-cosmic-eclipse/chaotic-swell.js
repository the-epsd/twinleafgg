"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaoticSwell = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ChaoticSwell extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '187';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CEC';
        this.name = 'Chaotic Swell';
        this.fullName = 'Chaotic Swell CEC';
        this.text = 'Whenever either player plays a Stadium card from their hand, discard that Stadium card after discarding this one. (The new Stadium card has no effect.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            store.log(state, game_1.GameLog.LOG_DISCARD_STADIUM_CHAOTIC_SWELL, { name: player.name, card: effect.trainerCard.name });
        }
        return state;
    }
}
exports.ChaoticSwell = ChaoticSwell;
