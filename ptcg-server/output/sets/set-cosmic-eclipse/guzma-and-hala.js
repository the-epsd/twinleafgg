"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuzmaAndHala = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const select_option_prompt_1 = require("../../game/store/prompts/select-option-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    effect.preventDefault = true;
    // If player has less than 2 cards in hand (excluding this card), only allow stadium search
    if (player.hand.cards.length < 2) {
        // Search for stadium only
        const blocked = [];
        player.deck.cards.forEach((card, index) => {
            if (!(card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.STADIUM)) {
                blocked.push(index);
            }
        });
        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { allowCancel: false, min: 0, max: 1, maxStadiums: 1, blocked }), cards => {
            cards = cards || [];
            player.deck.moveCardsTo(cards, player.hand);
            if (cards.length > 0) {
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
        });
        return state;
    }
    // Show options prompt for players with 2+ cards
    state = store.prompt(state, new select_option_prompt_1.SelectOptionPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, [
        'Search for a Stadium card from your deck',
        'Discard 2 cards from your hand. Search for a Pokemon Tool and Special Energy from your deck'
    ], {
        allowCancel: false,
        defaultValue: 0
    }), choice => {
        if (choice === 0) {
            // Option 1: Just search for stadium
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.STADIUM)) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { allowCancel: false, min: 0, max: 1, maxStadiums: 1, blocked }), cards => {
                cards = cards || [];
                player.deck.moveCardsTo(cards, player.hand);
                if (cards.length > 0) {
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
            });
        }
        else if (choice === 1) {
            // Option 2: Discard 2 cards and search for multiple card types
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), cards => {
                cards = cards || [];
                player.hand.moveCardsTo(cards, player.discard);
                cards.forEach(card => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                });
                // Search for tool, special energy, and stadium
                const blocked = [];
                player.deck.cards.forEach((card, index) => {
                    if (!((card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.SPECIAL) ||
                        (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL) ||
                        (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.STADIUM))) {
                        blocked.push(index);
                    }
                });
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { allowCancel: false, min: 0, max: 3, maxSpecialEnergies: 1, maxTools: 1, maxStadiums: 1, blocked }), cards => {
                    cards = cards || [];
                    player.deck.moveCardsTo(cards, player.hand);
                    if (cards.length > 0) {
                        state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                            return state;
                        });
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                });
            });
        }
    });
    return state;
}
class GuzmaAndHala extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '193';
        this.name = 'Guzma & Hala';
        this.fullName = 'Guzma & Hala CEC';
        this.text = 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.' +
            '' +
            'When you play this card, you may discard 2 other cards from your hand. If you do, you may also search for a Pokémon Tool card and a Special Energy card in this way.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GuzmaAndHala = GuzmaAndHala;
