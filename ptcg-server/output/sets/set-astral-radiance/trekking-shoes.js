"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrekkingShoes = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const __1 = require("../..");
class TrekkingShoes extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.name = 'Trekking Shoes';
        this.fullName = 'Trekking Shoes ASR';
        this.text = 'Look at the top card of your deck. You may put that card into your hand. If you don\'t, discard that card and draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 1);
            return store.prompt(state, new __1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop.cards // Fix error by changing toArray() to cards
            ), selected => {
                return store.prompt(state, new __1.ConfirmPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND), yes => {
                    if (yes) {
                        // Add card to hand
                        deckTop.moveCardsTo(deckTop.cards, player.hand);
                    }
                    else {
                        // Discard card
                        deckTop.moveTo(player.discard);
                        // Draw a card
                        player.deck.moveTo(player.hand, 1);
                    }
                    return state;
                });
            });
        }
        return state;
    }
}
exports.TrekkingShoes = TrekkingShoes;
