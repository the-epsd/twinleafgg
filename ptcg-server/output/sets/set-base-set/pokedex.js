"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokedex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Pokedex extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS'; // Replace with the appropriate set abbreviation
        this.name = 'Pokedex';
        this.fullName = 'Pokedex BS'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '87'; // Replace with the appropriate set number
        this.text = 'Look at up to 5 cards from the top of your deck and rearrange them as you like.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const deck = player.deck;
            const deckTop = new game_1.CardList();
            // Get up to 5 cards from the top of the deck
            const cards = deck.cards.slice(0, 5);
            player.deck.moveCardsTo(cards, deckTop);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), (rearrangedCards) => {
                if (rearrangedCards === null) {
                    return state;
                }
                deckTop.applyOrder(rearrangedCards);
                deckTop.moveTo(player.deck);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.Pokedex = Pokedex;
