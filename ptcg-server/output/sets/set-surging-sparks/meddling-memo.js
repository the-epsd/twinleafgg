"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeddlingMemo = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MeddlingMemo extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '181';
        this.regulationMark = 'H';
        this.name = 'Meddling Memo';
        this.fullName = 'Meddling Memo SSP';
        this.text = 'Your opponent counts the cards in their hand, shuffles those cards, and puts them on the bottom of their deck. If they do, they draw that many cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const newCards = opponent.hand.cards.length;
            this.shufflePlayerHand(opponent);
            opponent.hand.moveTo(opponent.deck);
            opponent.deck.moveTo(opponent.hand, newCards);
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
    shufflePlayerHand(player) {
        const hand = player.hand.cards;
        // Shuffle the hand using the Fisher-Yates shuffle algorithm
        for (let i = hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hand[i], hand[j]] = [hand[j], hand[i]];
        }
    }
}
exports.MeddlingMemo = MeddlingMemo;
