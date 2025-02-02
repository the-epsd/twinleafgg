"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EreikasInvitation = void 0;
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
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    if (opponent.hand.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Check if bench has open slots
    const openSlots = opponent.bench.filter(b => b.cards.length === 0);
    if (openSlots.length === 0) {
        // No open slots, throw error
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    try {
        const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
        store.reduceEffect(state, supporterEffect);
    }
    catch (_a) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    cards.forEach((card, index) => {
        opponent.hand.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
        opponent.switchPokemon(slots[index]);
    });
}
class EreikasInvitation extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Erika\'s Invitation';
        this.fullName = 'Erika\'s Invitation MEW';
        this.text = 'Your opponent reveals their hand, and you put a Basic Pokémon you find there onto your opponent\'s Bench. If you put a Pokémon onto their Bench in this way, switch in that Pokémon to the Active Spot.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EreikasInvitation = EreikasInvitation;
