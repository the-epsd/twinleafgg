"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artazon = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Artazon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PAL';
        this.name = 'Artazon';
        this.fullName = 'Artazon PAL';
        this.text = 'Once during each player\'s turn, that player may search their ' +
            'deck for a Basic Pokémon that doesn\'t have a Rule Box ' +
            'and put it onto their Bench. Then, that player shuffles their deck. ' +
            '(Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        const slots = player.bench.filter(b => b.cards.length === 0);
        if (player.deck.cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (slots.length < 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        else {
            // handle no open slots
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true }), selectedCards => {
                cards = selectedCards || [];
                if (cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) ||
                    cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                    cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                    cards[0].tags.includes(card_types_1.CardTag.POKEMON_EX) ||
                    cards[0].tags.includes(card_types_1.CardTag.RADIANT)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                }
                else {
                    cards.forEach((card, index) => {
                        player.deck.moveCardTo(card, slots[index]);
                        slots[index].pokemonPlayedTurn = state.turn;
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                }
            });
        }
    }
}
exports.Artazon = Artazon;
