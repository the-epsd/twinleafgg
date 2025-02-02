"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeker = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
function pickUpBenchedPokemon(next, store, state, player) {
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), selection => {
        const cardList = selection[0];
        cardList.moveTo(player.hand);
        cardList.clearEffects();
        next();
    });
}
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const playerHasBench = player.bench.some(b => b.cards.length > 0);
    const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!playerHasBench && !opponentHasBench) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (playerHasBench) {
        yield pickUpBenchedPokemon(next, store, state, player);
    }
    if (opponentHasBench) {
        yield pickUpBenchedPokemon(next, store, state, opponent);
    }
    return state;
}
class Seeker extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TM';
        this.name = 'Seeker';
        this.fullName = 'Seeker TRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.text = 'Each player returns 1 of his or her Benched Pokemon and all cards ' +
            'attached to it to his or her hand. (You return your Pokemon first.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Seeker = Seeker;
