"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LtSurgesStrategy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LtSurgesStrategy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNB';
        this.name = 'Lt. Surge\'s Strategy';
        this.fullName = 'Lt. Surge\'s Strategy UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '178';
        this.text = 'You can play this card only if you have more Prize cards remaining than your opponent. During this turn, you can play 3 Supporter cards (including this card).';
        this.playedSurgeThisTurn = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (this.playedSurgeThisTurn) {
            }
            else {
                // going to be increased by one in the play-trainer file
                player.supporterTurn = -2;
                player.hand.moveCardTo(this, player.discard);
                this.playedSurgeThisTurn = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.playedSurgeThisTurn = false;
        }
        return state;
    }
}
exports.LtSurgesStrategy = LtSurgesStrategy;
