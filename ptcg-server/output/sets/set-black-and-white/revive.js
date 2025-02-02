"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revive = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    // Player has no empty bench slot
    if (slots.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Player has no basic Pokemons in the discard pile
    if (!player.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true }), selected => {
        if (selected && selected.length > 0) {
            // Discard trainer only when user selected a Pokemon
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            // Recover discarded Pokemon
            player.discard.moveCardsTo(selected, slots[0]);
        }
    });
}
class Revive extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BLW';
        this.name = 'Revive';
        this.fullName = 'Revive BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.text = 'Put a Basic Pokemon from your discard pile onto your Bench.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Revive = Revive;
