"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lysandre = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
    });
}
class Lysandre extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FLF';
        this.name = 'Lysandre';
        this.fullName = 'Lysandre FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.text = 'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
            'Active Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Lysandre = Lysandre;
