"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kofu = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    if (player.hand.cards.length <= 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const deckBottom = new game_1.CardList();
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardsTo(cards, deckBottom);
    return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARDS_ORDER, deckBottom, { allowCancel: false }), order => {
        if (order === null) {
            return state;
        }
        deckBottom.applyOrder(order);
        deckBottom.moveTo(player.deck);
        player.deck.moveTo(player.hand, Math.min(4, player.deck.cards.length));
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class Kofu extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.set = 'SCR';
        this.name = 'Kofu';
        this.fullName = 'Kofu SCR';
        this.text = 'Put 2 cards from your hand on the bottom of your deck in any order. If you put 2 cards on the bottom of your deck in this way, draw 4 cards. (If you can\'t put 2 cards from your hand on the bottom of your deck, you can\'t use this card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Kofu = Kofu;
