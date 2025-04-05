"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jasmine = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jasmine extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEU';
        this.name = 'Jasmine';
        this.fullName = 'Jasmine TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.text = 'Search your deck for a [M] Pokémon, reveal it, and put it into your hand. If you go second and it\'s your first turn, search for 5 [M] Pokémon instead of 1. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const numPokemon = state.turn <= 2 ? 5 : 1;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.PokemonCard && card.cardType === card_types_1.CardType.METAL)) {
                    blocked.push(index);
                }
            });
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: numPokemon, allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return state;
                }
                prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
            return state;
        }
        return state;
    }
}
exports.Jasmine = Jasmine;
