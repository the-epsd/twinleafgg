"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiaAndCaitlin = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const select_option_prompt_1 = require("../../game/store/prompts/select-option-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // Check if there are any valid supporters in discard (excluding Cynthia & Caitlin)
    const validSupportersInDiscard = player.discard.cards.filter(c => c instanceof trainer_card_1.TrainerCard &&
        c.trainerType === card_types_1.TrainerType.SUPPORTER &&
        c.name !== 'Cynthia & Caitlin');
    // If no valid supporters, just do the discard and draw effect
    if (validSupportersInDiscard.length === 0) {
        if (player.hand.cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        // Choose a card to discard
        state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false }), discarded => {
            if (discarded && discarded.length > 0) {
                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: discarded[0].name });
                player.hand.moveCardsTo(discarded, player.discard);
                // Draw 3 cards
                const drawnCards = player.deck.cards.slice(0, 3);
                player.deck.moveCardsTo(drawnCards, player.hand);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            }
        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    // Create blocked indices for Cynthia & Caitlin cards
    const blocked = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof trainer_card_1.TrainerCard && card.name === 'Cynthia & Caitlin') {
            blocked.push(index);
        }
    });
    // Show the options prompt
    state = store.prompt(state, new select_option_prompt_1.SelectOptionPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, [
        'Put a Supporter card from your discard pile into your hand.',
        'Put a Supporter card from your discard pile into your hand, and discard another card from your hand to draw 3 cards.'
    ], {
        allowCancel: true,
        defaultValue: 0
    }), choice => {
        if (choice === 0) {
            // Option 1: Just recover a supporter
            if (validSupportersInDiscard.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                if (selected && selected.length > 0) {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });
                    player.discard.moveCardsTo(selected, player.hand);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        else if (choice === 1) {
            // Option 2: Discard a card first, then recover a supporter and draw 3
            if (player.hand.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // First, choose a card to discard
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false }), discarded => {
                if (discarded && discarded.length > 0) {
                    const discardedCard = discarded[0];
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: discardedCard.name });
                    // Then choose a supporter to recover
                    state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                        if (selected && selected.length > 0) {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });
                            player.discard.moveCardsTo(selected, player.hand);
                            // Now move the discarded card to discard
                            player.hand.moveCardsTo(discarded, player.discard);
                            // Draw 3 cards
                            const drawnCards = player.deck.cards.slice(0, 3);
                            player.deck.moveCardsTo(drawnCards, player.hand);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        }
                    });
                }
            });
        }
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
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
            if (effect.preventDefault) {
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
