"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsInPaldea = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class StudentsInPaldea extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.set = 'PAF';
        this.name = 'Paldean Student';
        this.fullName = 'Paldean Student PAF';
        this.text = 'Search your deck for a Pokémon that doesn\'t have a Rule Box, reveal it, and put it into your hand. For each other Students in Paldea in your discard pile, you may search your deck for another Pokémon that doesn’t have a Rule Box. Then, shuffle your deck. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cardsInDiscard = effect.player.discard.cards.filter(c => c.name === 'Paldean Student');
            const cardsToTake = 1 + cardsInDiscard.length;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if ((card instanceof game_1.PokemonCard &&
                    (card.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                        card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                        card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                        card.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
                        card.tags.includes(card_types_1.CardTag.RADIANT)))) {
                    blocked.push(index);
                }
            });
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: cardsToTake, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.StudentsInPaldea = StudentsInPaldea;
