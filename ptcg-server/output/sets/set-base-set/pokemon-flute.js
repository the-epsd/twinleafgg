"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonFlute = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
class PokemonFlute extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS'; // Replace with the appropriate set abbreviation
        this.name = 'Pokemon Flute';
        this.fullName = 'Pokemon Flute BS'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '86'; // Replace with the appropriate set number
        this.text = 'Choose 1 Basic Pokémon card from your opponent\'s discard pile and put it onto his or her Bench. (You can\'t play Pokémon Flute if your opponent\'s Bench is full.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's bench is full
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let cards = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH, opponent.discard, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const card = cards[0];
                    const slot = openSlots[0];
                    opponent.discard.moveCardTo(card, slot);
                    slot.pokemonPlayedTurn = state.turn;
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.PokemonFlute = PokemonFlute;
