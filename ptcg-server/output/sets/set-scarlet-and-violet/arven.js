"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arven = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
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
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.TOOL) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    const maxPokemons = Math.min(pokemons, 1);
    const maxTrainers = Math.min(trainers, 1);
    const count = maxPokemons + maxTrainers;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardTo(self, player.supporter);
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Arven extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.name = 'Arven';
        this.fullName = 'Arven PAL';
        this.text = 'Search your deck for a W Pokemon and an Item ' +
            'card, reveal them, and put them into your hand. ' +
            'Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Arven = Arven;
