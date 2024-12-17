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
            const tempOpp = new game_1.CardList();
            effect.preventDefault = true;
            opponent.deck.moveTo(tempOpp, 3);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT, tempOpp.cards), () => {
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT, tempOpp.cards), () => {
                    const pokemonCards = tempOpp.cards.filter(card => card instanceof game_1.PokemonCard);
                    const nonPokemonCards = tempOpp.cards.filter(card => !(card instanceof game_1.PokemonCard));
                    pokemonCards.forEach(card => {
                        tempOpp.moveCardTo(card, opponent.hand);
                    });
                    nonPokemonCards.forEach(card => {
                        tempOpp.moveCardTo(card, opponent.deck);
                    });
                    const temp = new game_1.CardList();
                    player.deck.moveTo(temp, 3);
                    return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT, temp.cards), () => {
                        return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT, temp.cards), () => {
                            const pokemonCards = temp.cards.filter(card => card instanceof game_1.PokemonCard);
                            const nonPokemonCards = temp.cards.filter(card => !(card instanceof game_1.PokemonCard));
                            pokemonCards.forEach(card => {
                                temp.moveCardTo(card, player.hand);
                            });
                            nonPokemonCards.forEach(card => {
                                temp.moveCardTo(card, player.deck);
                            });
                            player.supporter.moveCardTo(this, player.discard);
                            state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), playerOrder => {
                                player.deck.applyOrder(playerOrder);
                                return state;
                            });
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), oppOrder => {
                                opponent.deck.applyOrder(oppOrder);
                                return state;
                            });
                        });
                    });
                });
            });
        }
        return state;
    }
}
exports.LureModule = LureModule;
