"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueStretcher = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class RescueStretcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Rescue Stretcher';
        this.fullName = 'Rescue Stretcher GRI';
        this.text = 'Choose 1:' +
            '' +
            'Put a Pokémon from your discard pile into your hand.' +
            'Shuffle 3 Pokémon from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let pokemonInDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard;
                if (isPokemon) {
                    pokemonInDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Player does not have correct cards in discard
            if (pokemonInDiscard === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_message_1.GameMessage.CHOOSE_CARD_TO_DECK,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: Math.min(pokemonInDiscard, 3), max: 3, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            cards.forEach((card, index) => {
                                store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                            });
                            player.discard.moveCardsTo(cards, player.deck);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.CHOOSE_CARD_TO_HAND,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            cards.forEach((card, index) => {
                                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                            });
                            player.discard.moveCardsTo(cards, player.hand);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            return state;
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.RescueStretcher = RescueStretcher;
