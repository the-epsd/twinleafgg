"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxRod = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
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
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 5, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.discard.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
}
class MaxRod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Max Rod';
        this.fullName = 'Max Rod SV8a';
        this.text = 'Choose up to 5 in any combination of Pokémon and Basic Energy cards from your discard pile and put them into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MaxRod = MaxRod;
