"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcroBike = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
class AcroBike extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PRC';
        this.name = 'Acro Bike';
        this.fullName = 'Acro Bike PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.text = 'Look at the top 2 cards of your deck and put 1 of them into your hand. ' +
            'Discard the other card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 2);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.AcroBike = AcroBike;
