"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoingHorn = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const slots = opponent.bench.filter(b => b.cards.length === 0);
    if (opponent.discard.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Check if bench has open slots
    const openSlots = opponent.bench.filter(b => b.cards.length === 0);
    if (openSlots.length === 0) {
        // No open slots, throw error
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    cards.forEach((card, index) => {
        opponent.discard.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
}
class EchoingHorn extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CRE';
        this.set2 = 'chillingreign';
        this.setNumber = '136';
        this.name = 'Echoing Horn';
        this.fullName = 'Echoing Horn CRE';
        this.text = 'Search your deck for a Basic Pokémon and put it onto your ' +
            'Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EchoingHorn = EchoingHorn;
