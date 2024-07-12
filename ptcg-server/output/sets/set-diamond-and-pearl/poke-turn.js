"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeTurn = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Create list of non - Pokemon SP slots
    const blocked = [];
    let hasPokemonSp = false;
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const isPokemonSp = card.tags.includes(card_types_1.CardTag.POKEMON_SP);
        hasPokemonSp = hasPokemonSp || isPokemonSp;
        if (!isPokemonSp) {
            blocked.push(target);
        }
    });
    if (!hasPokemonSp) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: true, blocked }), targets => {
        if (targets && targets.length > 0) {
            // Discard trainer only when user selected a Pokemon
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            targets[0].moveTo(player.hand);
            targets[0].damage = 0;
            targets[0].clearEffects();
        }
    });
}
class PokeTurn extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Poke Turn';
        this.fullName = 'Poke Turn PL';
        this.text = 'Return 1 of your Pokemon SP and all cards attached to it to your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokeTurn = PokeTurn;
