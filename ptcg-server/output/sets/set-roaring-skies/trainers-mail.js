"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainersMail = void 0;
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const card_list_1 = require("../../game/store/state/card-list");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const deckTop = new card_list_1.CardList();
    player.deck.moveTo(deckTop, 4);
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const blocked = [];
    deckTop.cards.forEach((card, index) => {
        if (card instanceof trainer_card_1.TrainerCard && card.name === 'Trainers\' Mail') {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: card_types_1.SuperType.TRAINER }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    deckTop.moveCardsTo(cards, player.hand);
    deckTop.moveTo(player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class TrainersMail extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'ROS';
        this.name = 'Trainers\' Mail';
        this.fullName = 'Trainers\' Mail ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.text = 'Look at the top 4 cards of your deck. You may reveal a Trainer card ' +
            'you find there (except for Trainers\' Mail) and put it into your hand. ' +
            'Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TrainersMail = TrainersMail;
