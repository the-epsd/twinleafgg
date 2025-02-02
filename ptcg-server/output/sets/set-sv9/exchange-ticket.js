"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeTicket = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ExchangeTicket extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.name = 'Exchange Ticket';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.fullName = 'Exchange Ticket SV9';
        this.text = 'Count your Prize cards and shuffle them face down, then put them at the bottom of your deck. If you do, add that many cards from the top of your deck to your Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.cards.length > 0);
            const prizeCount = prizes.reduce((sum, p) => sum + p.cards.length, 0);
            if (prizeCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Move the trainer card to discard
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            // Collect all prize cards
            const allPrizeCards = [];
            prizes.forEach(p => allPrizeCards.push(...p.cards));
            // Shuffle the prize cards
            this.shuffleArray(allPrizeCards);
            // Move prize cards to the bottom of the deck
            allPrizeCards.forEach(card => {
                player.deck.cards.unshift(card);
            });
            // Clear the prize cards
            prizes.forEach(p => p.cards = []);
            // Draw cards from the top of the deck to the prize cards
            for (let i = 0; i < prizeCount; i++) {
                const card = player.deck.cards.pop();
                if (card) {
                    const prize = player.prizes.find(p => p.cards.length === 0);
                    if (prize) {
                        prize.cards.push(card);
                    }
                    else {
                        player.deck.cards.push(card);
                    }
                }
            }
            // Set the new prize cards to be face down
            player.prizes.forEach(p => p.isSecret = true);
            player.supporter.moveCardTo(this, player.discard);
            return state;
        }
        return state;
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
exports.ExchangeTicket = ExchangeTicket;
