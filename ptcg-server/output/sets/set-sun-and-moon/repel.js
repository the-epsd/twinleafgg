"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!opponentHasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
        targets = results || [];
        next();
    });
    if (targets.length > 0) {
        opponent.active.clearEffects();
        opponent.switchPokemon(targets[0]);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Repel extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SUM';
        this.name = 'Repel';
        this.fullName = 'Repel SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.text = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Repel = Repel;
