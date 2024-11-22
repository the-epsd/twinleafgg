"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdinaryRod = void 0;
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
    const pokemonAndEnergyInDiscardPile = player.discard.cards.filter(c => c instanceof game_1.PokemonCard || (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)).length;
    if (pokemonAndEnergyInDiscardPile === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemons = 0;
    let energies = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            energies += 1;
        }
        else if (c instanceof game_1.PokemonCard) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(pokemons, 2);
    const maxEnergies = Math.min(energies, 2);
    const count = maxPokemons + maxEnergies;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class OrdinaryRod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.regulationMark = 'D';
        this.name = 'Ordinary Rod';
        this.fullName = 'Ordinary Rod SSH';
        this.text = 'Choose 1 or both:' +
            '' +
            'Shuffle up to 2 Pokémon from your discard pile into your deck.' +
            'Shuffle up to 2 basic Energy cards from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.OrdinaryRod = OrdinaryRod;
