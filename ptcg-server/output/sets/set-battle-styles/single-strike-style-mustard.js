"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeStyleMustard = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
class SingleStrikeStyleMustard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Single Strike Style Mustard';
        this.fullName = 'Single Strike Style Mustard BST';
        this.text = 'You can play this card only when it is the last card in your hand. ' +
            '' +
            'Search your deck for a Single Strike Pokémon and put it onto your Bench. Then, shuffle your deck. If you searched your deck in this way, draw 5 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            const hasPokemon = player.deck.cards.some(c => {
                return c instanceof pokemon_card_1.PokemonCard && c.tags.includes(card_types_1.CardTag.SINGLE_STRIKE);
            });
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && !card.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                    blocked.push(index);
                }
            });
            const slot = player.bench.find(b => b.cards.length === 0);
            const hasEffect = (hasPokemon && slot) || player.deck.cards.length > 0;
            if (cards.length !== 0 || !hasEffect) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // It is not possible to recover Water Pokemon,
            // but we can still draw 5 cards
            if (!hasPokemon || slot === undefined) {
                player.deck.moveTo(player.hand, 5);
                return state;
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blocked }), selected => {
                const cards = selected || [];
                player.deck.moveCardsTo(cards, slot);
                slot.pokemonPlayedTurn = state.turn;
                player.deck.moveTo(player.hand, 5);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.SingleStrikeStyleMustard = SingleStrikeStyleMustard;
