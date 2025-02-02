"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetStamp = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class ResetStamp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UNM';
        this.name = 'Reset Stamp';
        this.fullName = 'Reset Stamp UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '206';
        this.text = 'Your opponent shuffles their hand into their deck and draws a card for each of their remaining Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            if (opponentCards.length === 0 && opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            opponent.hand.moveCardsTo(opponentCards, opponent.deck);
            store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
            });
            opponent.deck.moveTo(opponent.hand, Math.min(opponent.getPrizeLeft(), opponent.deck.cards.length));
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.ResetStamp = ResetStamp;
