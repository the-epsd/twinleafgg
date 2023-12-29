"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyLotto = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class EnergyLotto extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Energy Lotto';
        this.fullName = 'Energy Lotto LOR';
        this.text = 'Look at the top 7 cards of your deck. You may reveal an Energy card you find there and put it into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 7);
            // Check if any cards drawn are basic energy
            const pokemonDrawn = temp.cards.filter(card => {
                return card instanceof game_1.PokemonCard && card.superType === card_types_1.SuperType.ENERGY;
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // If no energy cards were drawn, move all cards to hand
            if (pokemonDrawn.length == 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards), () => {
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
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: false, min: 0, max: 1 }), chosenCards => {
                    if (chosenCards.length > 0) {
                        // Move chosen Pokemon to hand
                        const pokemon = chosenCards[0];
                        temp.moveCardTo(pokemon, player.hand);
                    }
                    else {
                        // No Pokemon chosen, shuffle all back
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.deck);
                        });
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
        }
        return state;
    }
}
exports.EnergyLotto = EnergyLotto;
