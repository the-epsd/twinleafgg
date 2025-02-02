"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomReceiver = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const cards = [];
    let supporter;
    for (let i = 0; i < player.deck.cards.length; i++) {
        const card = player.deck.cards[i];
        cards.push(card);
        if (card instanceof trainer_card_1.TrainerCard
            && card.trainerType === card_types_1.TrainerType.SUPPORTER) {
            supporter = card;
            break;
        }
    }
    yield store.prompt(state, [
        new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
        new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)
    ], () => next());
    if (supporter !== undefined) {
        player.deck.moveCardTo(supporter, player.hand);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class RandomReceiver extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DEX';
        this.name = 'Random Receiver';
        this.fullName = 'Random Receiver DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'Reveal cards from the top of your deck until you reveal a Supporter ' +
            'card. Put it into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RandomReceiver = RandomReceiver;
