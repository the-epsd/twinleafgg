"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kindler = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fire Energy';
    });
    if (!hasEnergyInHand) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), cards => {
        cards = cards || [];
        if (cards.length === 0) {
            return;
        }
        player.hand.moveCardsTo(cards, player.discard);
    });
    const deckTop = new game_1.CardList();
    player.deck.moveTo(deckTop, 7);
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 0, max: 2, allowCancel: false }), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
        });
    });
}
class Kindler extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.regulationMark = 'H';
        this.name = 'Kindler';
        this.fullName = 'Kindler BRS';
        this.text = 'You can use this card only if you discard a [R] Energy card from your hand.' +
            '' +
            'Look at the top 7 cards of your deck and put up to 2 of them into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Kindler = Kindler;
