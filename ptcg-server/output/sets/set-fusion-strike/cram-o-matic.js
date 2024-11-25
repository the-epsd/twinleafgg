"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Creamomatic = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    cards = player.hand.cards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType == card_types_1.TrainerType.ITEM);
    if (cards.length < 1) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // prepare card list without Junk Arm
    const handTemp = new game_1.CardList();
    handTemp.cards = player.hand.cards;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardsTo(cards, player.discard);
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    let coin1Result = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), (result) => {
        coin1Result = result;
        next();
    });
    if (coin1Result) {
        let cards = [];
        yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), (selected) => {
            cards = selected || [];
            next();
        });
        player.deck.moveCardsTo(cards, player.hand);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
    });
}
class Creamomatic extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '229';
        this.regulationMark = 'E';
        this.name = 'Cram-o-matic';
        this.fullName = 'Cram-o-matic FST';
        this.text = 'You can use this card only if you discard another Item card from your hand.' +
            '' +
            'Flip a coin. If heads, search your deck for a card and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Creamomatic = Creamomatic;
