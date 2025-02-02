"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drayton = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // Count tools and items separately
    let trainers = 0;
    let pokemons = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof trainer_card_1.TrainerCard) {
            trainers += 1;
        }
        else if (c instanceof game_1.PokemonCard) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxTrainers = Math.min(trainers, 1);
    const maxPokemons = Math.min(pokemons, 1);
    // Total max is sum of max for each 
    const count = maxTrainers + maxPokemons;
    const deckTop = new card_list_1.CardList();
    player.deck.moveTo(deckTop, 7);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 0, max: count, allowCancel: false, blocked, maxTrainers, maxPokemons }), selected => {
        cards = selected || [];
        next();
    });
    deckTop.moveCardsTo(cards, player.hand);
    deckTop.moveTo(player.deck);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Drayton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Drayton';
        this.fullName = 'Drayton SV7a';
        this.text = 'Look at the top 7 cards of your deck. Choose a Pokémon and a Trainer card from those cards, reveal them, and put them into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Drayton = Drayton;
