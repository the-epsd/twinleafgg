"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceFlute = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class PerformanceFlute extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Performance Flute';
        this.fullName = 'Performance Flute SV6';
        this.text = 'Reveal the top 5 cards of your opponent\'s deck, and put any number of Basic Pokémon you find there onto your opponent\'s Bench. Then, they shuffle the remaining cards back into their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            // Check if bench has open slots
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (opponent.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 5);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: openSlots.length, allowCancel: false }), selected => {
                const cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                cards.forEach((card, index) => {
                    deckTop.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                    deckTop.moveTo(opponent.deck);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            });
        }
        return state;
    }
}
exports.PerformanceFlute = PerformanceFlute;
