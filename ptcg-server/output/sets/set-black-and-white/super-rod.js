"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperRod = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let pokemonsOrEnergyInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof pokemon_card_1.PokemonCard;
        const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        if (isPokemon || isBasicEnergy) {
            pokemonsOrEnergyInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Player does not have correct cards in discard
    if (pokemonsOrEnergyInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const max = Math.min(3, pokemonsOrEnergyInDiscard);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 3, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    player.hand.moveCardTo(self, player.discard);
    player.discard.moveCardsTo(cards, player.deck);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class SuperRod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BW';
        this.name = 'Super Rod';
        this.fullName = 'Super Rod NV';
        this.text = 'Shuffle 3 in any combination of Pokemon and basic Energy cards from ' +
            'your discard pile back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SuperRod = SuperRod;
