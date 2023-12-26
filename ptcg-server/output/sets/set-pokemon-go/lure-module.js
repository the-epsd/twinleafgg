"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LureModule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class LureModule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Lure Module';
        this.fullName = 'Lure Module PGO';
        this.text = 'Each player reveals the top 3 cards of their deck and puts all Pokémon they find there into their hand. Then, each player shuffles the other cards back into their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 3);
            // Check if any cards drawn are basic energy
            const pokemonDrawn = temp.cards.filter(card => {
                return card instanceof game_1.PokemonCard;
            });
            // If no energy cards were drawn, move all cards to deck
            if (pokemonDrawn.length == 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id && opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards), () => {
                    temp.cards.forEach(card => {
                        temp.moveCardTo(card, player.deck);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
            else {
                pokemonDrawn.forEach(pokemon => {
                    temp.moveCardTo(pokemon, player.deck);
                });
                temp.cards.forEach(card => {
                    temp.moveCardTo(card, player.deck);
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            }
        }
        const player = effect.player;
        const opponent = game_1.StateUtils.getOpponent(state, player);
        const tempOpp = new game_1.CardList();
        opponent.deck.moveTo(tempOpp, 3);
        const pokemonDrawnOpp = tempOpp.cards.filter(card => {
            return card instanceof game_1.PokemonCard;
        });
        // If no energy cards were drawn, move all cards to deck
        if (pokemonDrawnOpp.length == 0) {
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id && opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, tempOpp.cards), () => {
                tempOpp.cards.forEach(card => {
                    tempOpp.moveCardTo(card, opponent.deck);
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                    return state;
                });
            });
        }
        else {
            pokemonDrawnOpp.forEach(pokemon => {
                tempOpp.moveCardTo(pokemon, opponent.deck);
            });
            tempOpp.cards.forEach(card => {
                tempOpp.moveCardTo(card, opponent.deck);
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
                return state;
            });
            return state;
        }
    }
}
exports.LureModule = LureModule;
