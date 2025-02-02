"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowerShopLady = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const energy_card_1 = require("../../game/store/card/energy-card");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    let pokemons = 0;
    let energies = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            energies += 1;
        }
        else if (c instanceof pokemon_card_1.PokemonCard) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    // This will prevent unblocked supporter to appear in the discard pile
    effect.preventDefault = true;
    const maxPokemons = Math.min(pokemons, 3);
    const maxEnergies = Math.min(energies, 3);
    const count = maxPokemons + maxEnergies;
    if (count === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: count, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    player.hand.moveCardTo(self, player.supporter);
    player.discard.moveCardsTo(cards, player.deck);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class FlowerShopLady extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UD';
        this.name = 'Flower Shop Lady';
        this.fullName = 'Flower Shop Lady UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.text = 'Search your discard pile for 3 Pokemon and 3 basic Energy cards. ' +
            'Show them to your opponent and shuffle them into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FlowerShopLady = FlowerShopLady;
