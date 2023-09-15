"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iono = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Iono extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.name = 'Iono';
        this.fullName = 'Iono';
        this.text = 'Each player shuffles his or her hand into his or her deck. ' +
            'Then, each player draws a card for each of his or her remaining Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cards = player.hand.cards.filter(c => c !== this);
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Create deckBottom and move hand into it
            const deckBottom = new game_1.CardList();
            player.hand.moveTo(deckBottom, cards.length);
            // Create deckBottom for opponent and move hand
            const opponentdeckBottom = new game_1.CardList();
            opponent.hand.moveTo(opponentdeckBottom, cards.length);
            // Later, move deckBottom to player's deck
            deckBottom.moveTo(player.deck, cards.length);
            opponentdeckBottom.moveTo(opponent.deck, cards.length);
            player.deck.moveTo(player.hand, player.getPrizeLeft());
            opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
            return state;
        }
        return state;
    }
}
exports.Iono = Iono;
