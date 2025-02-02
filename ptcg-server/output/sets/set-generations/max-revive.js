"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxRevive = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class MaxRevive extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GEN'; // Replace with the appropriate set abbreviation
        this.name = 'Max Revive';
        this.fullName = 'Max Revive GEN'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '65'; // Replace with the appropriate set number
        this.text = 'Put a Pokémon from your discard pile on top of your deck.';
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
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let cards = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, { superType: game_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const deckTop = new game_1.CardList();
                    cards.forEach(card => {
                        player.discard.moveCardTo(card, deckTop);
                    });
                    return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                        if (order === null) {
                            return state;
                        }
                        deckTop.applyOrder(order);
                        deckTop.moveToTopOfDestination(player.deck);
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        if (cards.length > 0) {
                            const opponent = game_1.StateUtils.getOpponent(state, player);
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                        }
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.MaxRevive = MaxRevive;
