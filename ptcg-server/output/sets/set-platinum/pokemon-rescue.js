"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonRescue = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Player has no Pokemons in the discard pile
    if (!player.discard.cards.some(c => c.superType === card_types_1.SuperType.POKEMON)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true }), selected => {
        if (selected && selected.length > 0) {
            // Discard trainer only when user selected a Pokemon
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            // Recover discarded Pokemon
            player.discard.moveCardsTo(selected, player.hand);
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class PokemonRescue extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PL';
        this.name = 'Pokemon Rescue';
        this.fullName = 'Pokemon Rescue PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.text = 'Search your discard pile for a Pokemon, show it to your opponent, ' +
            'and put it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokemonRescue = PokemonRescue;
