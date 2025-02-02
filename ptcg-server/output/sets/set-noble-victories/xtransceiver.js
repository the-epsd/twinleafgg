"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xtransceiver = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let coin1Result = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin1Result = result;
        next();
    });
    let cards = [];
    if (coin1Result) {
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), (selected) => {
            cards = selected || [];
            next();
        });
        player.deck.moveCardsTo(cards, player.hand);
    }
    else {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    const opponent = game_1.StateUtils.getOpponent(state, player);
    yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
    });
}
class Xtransceiver extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.regulationMark = 'E';
        this.name = 'Xtransceiver';
        this.fullName = 'Xtransceiver NVI';
        this.text = 'Flip a coin. If heads, search your deck for a Supporter card, reveal it, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Xtransceiver = Xtransceiver;
