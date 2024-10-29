"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gambler = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gambler extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Gambler';
        this.fullName = 'Gambler FO';
        this.text = 'Shuffle your hand into your deck. Flip a coin. If heads, draw 8 cards. If tails, draw 1 card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.deck);
            store.prompt(state, [
                new game_1.ShuffleDeckPrompt(player.id),
            ], deckOrder => {
                player.deck.applyOrder(deckOrder);
                player.deck.moveTo(player.hand, 4);
            });
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    player.deck.moveTo(player.hand, 8);
                }
                else {
                    player.deck.moveTo(player.hand, 1);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Gambler = Gambler;
