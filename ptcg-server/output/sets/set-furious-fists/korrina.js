"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Korrina = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    let pokemons = 0;
    let trainers = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM) {
            trainers += 1;
        }
        else if (c instanceof pokemon_card_1.PokemonCard && c.cardType === card_types_1.CardType.FIGHTING) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const maxPokemons = Math.min(pokemons, 1);
    const maxTrainers = Math.min(trainers, 1);
    const count = maxPokemons + maxTrainers;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Korrina extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FFI';
        this.name = 'Korrina';
        this.fullName = 'Korrina FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.text = 'Search your deck for a F Pokemon and an Item card, reveal them, ' +
            'and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Korrina = Korrina;
