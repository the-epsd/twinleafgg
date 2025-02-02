"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marnie = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Marnie extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Marnie';
        this.fullName = 'Marnie SSH';
        this.text = 'Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, you draw 5 cards, and your opponent draws 4 cards.';
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
            player.deck.moveTo(player.hand, Math.min(5, player.deck.cards.length));
            opponent.deck.moveTo(opponent.hand, Math.min(4, opponent.deck.cards.length));
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.Marnie = Marnie;
