"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iono = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Iono extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '185';
        this.name = 'Iono';
        this.fullName = 'Iono PAL';
        this.text = 'Each player shuffles his or her hand into his or her deck. ' +
            'Then, each player draws a card for each of his or her remaining Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cards = player.hand.cards.filter(c => c !== this);
            const deckBottom = new game_1.CardList();
            const opponentDeckBottom = new game_1.CardList();
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.hand.cards.length === 0 && opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardsTo(cards, deckBottom);
            opponent.hand.moveTo(opponentDeckBottom);
            deckBottom.moveTo(player.deck);
            opponentDeckBottom.moveTo(opponent.deck);
            player.deck.moveTo(player.hand, player.getPrizeLeft());
            opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
        }
        return state;
    }
}
exports.Iono = Iono;
