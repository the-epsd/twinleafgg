"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugCatchingSet = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let grassPokemonOrEnergyCount = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        const isPokemon = c instanceof pokemon_card_1.PokemonCard && c.cardType === card_types_1.CardType.GRASS;
        const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Grass Energy';
        if (isPokemon || isBasicEnergy) {
            grassPokemonOrEnergyCount += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxGrassPokemonOrEnergyCount = Math.min(grassPokemonOrEnergyCount, 2);
    const deckTop = new game_1.CardList();
    player.deck.moveTo(deckTop, 7);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 0, max: maxGrassPokemonOrEnergyCount, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        deckTop.moveTo(player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    deckTop.moveCardsTo(cards, player.hand);
    deckTop.moveTo(player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class BugCatchingSet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.name = 'Bug Catching Set';
        this.fullName = 'Bug Catching Set TWM';
        this.text = 'Look at the top 7 cards of your deck, and put up to 2 in any combination of [G] Pokémon and Basic [G] Energy cards you find there into your hand. Shuffle the remaining cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.BugCatchingSet = BugCatchingSet;
