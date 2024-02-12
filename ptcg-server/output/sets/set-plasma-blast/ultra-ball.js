"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // prepare card list without Junk Arm
    const handTemp = new card_list_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 2, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    player.hand.moveCardTo(self, player.discard);
    player.hand.moveCardsTo(cards, player.discard);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.deck.moveCardsTo(cards, player.hand);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class UltraBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLB';
        this.name = 'Ultra Ball';
        this.fullName = 'Ultra Ball PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.text = 'Discard 2 cards from your hand. (If you can\'t discard 2 cards, you ' +
            'can\'t play this card.) Search your deck for a Pokemon, reveal it, and ' +
            'put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.UltraBall = UltraBall;
