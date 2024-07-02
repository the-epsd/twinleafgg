"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tulip = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemons = 0;
    let energies = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Psychic Energy') {
            energies += 1;
        }
        else if (c instanceof game_1.PokemonCard && c.cardType === card_types_1.CardType.PSYCHIC && c.stage === card_types_1.Stage.BASIC) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(pokemons, 4);
    const maxEnergies = Math.min(energies, 4);
    const count = 4;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.supporterTurn += 1;
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Tulip extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '181';
        this.regulationMark = 'G';
        this.name = 'Tulip';
        this.fullName = 'Tulip PAR';
        this.text = 'Put up to 4 in any combination of [P] Pokémon and Basic [P] Energy cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Tulip = Tulip;
