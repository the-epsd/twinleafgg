"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiaAndCaitlin = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let supporterInDiscard = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) {
            supporterInDiscard += 1;
        }
    });
    if (supporterInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // Do not discard the card yet
    effect.preventDefault = true;
    // prepare card list without Self
    const handTemp = new card_list_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    let recovered = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false }), selected => {
        recovered = selected || [];
        next();
    });
    // Operation canceled by the user
    if (recovered.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cards, player.discard);
    player.discard.moveCardsTo(recovered, player.hand);
    player.deck.moveTo(player.hand, 3);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.supporterTurn = 1;
    return state;
}
class CynthiaAndCaitlin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '189';
        this.name = 'Cynthia & Caitlin';
        this.fullName = 'Cynthia & Caitlin CEC';
        this.text = 'Put a Supporter card from your discard pile into your hand. You can\'t choose Cynthia & Caitlin or a card you discarded with the effect of this card.' +
            '' +
            'When you play this card, you may discard another card from your hand. If you do, draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CynthiaAndCaitlin = CynthiaAndCaitlin;
