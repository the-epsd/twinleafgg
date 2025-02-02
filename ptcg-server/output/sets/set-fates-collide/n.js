"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N_Supporter = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class N_Supporter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'N';
        this.fullName = 'N FCO';
        this.text = 'Each player shuffles his or her hand into his or her deck. Then, each player draws a card for each of his or her remaining Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cards = player.hand.cards.filter(c => c !== this);
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardsTo(cards, player.deck);
            opponent.hand.moveCardsTo(opponentCards, opponent.deck);
            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
            store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
            });
            player.deck.moveTo(player.hand, Math.min(player.getPrizeLeft(), player.deck.cards.length));
            opponent.deck.moveTo(opponent.hand, Math.min(opponent.getPrizeLeft(), opponent.deck.cards.length));
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.N_Supporter = N_Supporter;
