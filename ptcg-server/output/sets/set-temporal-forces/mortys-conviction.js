"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MortysConviction = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 1) {
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
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardsTo(cards, player.discard);
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
    const cardsToDraw = opponentBenched;
    player.deck.moveTo(player.hand, cardsToDraw);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class MortysConviction extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'Morty\'s Conviction';
        this.fullName = 'Morty\'s Conviction TEF';
        this.text = 'You can use this card only if you discard another card from your hand.' +
            '' +
            'Draw a card for each of your opponent\'s Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MortysConviction = MortysConviction;
