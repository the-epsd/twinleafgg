"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokedexHandy = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const deckTop = new card_list_1.CardList();
    player.deck.moveTo(deckTop, 2);
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class PokedexHandy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Pokedex HANDY910is';
        this.fullName = 'Pokedex HANDY910is DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.text = 'Look at the top 2 cards of your deck, choose 1 of them, and put it into ' +
            'your hand. Put the other card on the bottom of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokedexHandy = PokedexHandy;
