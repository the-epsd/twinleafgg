"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiaAndCaitlin = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const blocked = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof trainer_card_1.TrainerCard && card.name === 'Cynthia & Caitlin') {
            blocked.push(index);
        }
    });
    cards = player.hand.cards.filter(c => c !== self);
    if (!player.discard.cards.some(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) &&
        cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let recovered = [];
    // no supporter to recover, has to draw cards
    if (!player.discard.cards.some(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER)) {
        state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1, blocked }), cards => {
            cards = cards || [];
            player.hand.moveCardsTo(cards, player.discard);
            cards.forEach((card, index) => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
            });
            player.deck.moveTo(player.hand, 3);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        });
    }
    else if (cards.length === 0) { // supporter available but can't discard
        state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
            recovered = selected || [];
            recovered.forEach(c => {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
            });
            player.discard.moveCardsTo(recovered, player.hand);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        });
    }
    else { // supporter available, has to recover supporter, option to draw cards
        let discardedCards = [];
        state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS), wantToUse => {
            if (wantToUse) {
                state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                    discardedCards = cards || [];
                    discardedCards.forEach((card, index) => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                    });
                    state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                        recovered = selected || [];
                        recovered.forEach(c => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
                        });
                        player.discard.moveCardsTo(recovered, player.hand);
                        player.hand.moveCardsTo(discardedCards, player.discard);
                        player.deck.moveTo(player.hand, 3);
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    });
                });
            }
            else {
                state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                    recovered = selected || [];
                    recovered.forEach(c => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: c.name });
                    });
                    player.discard.moveCardsTo(recovered, player.hand);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            }
            return state;
        });
    }
    return state;
}
class CynthiaAndCaitlin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
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
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            // Creates array of all valid supporters aka supporters that are not Cynthia & Caitlin
            const validSupportersInDiscard = player.discard.cards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER && c !== this);
            /*
              Checks if array contains supporters that are not Cynthia & Caitlin.
              If no supporters in discard pile that are not Cynthia & Caitlin exists, then the only
              supporters in discard are Cynthia & Caitlin, so you can't play this card.
            */
            if (validSupportersInDiscard.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CynthiaAndCaitlin = CynthiaAndCaitlin;
