"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeRope = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const playerHasBench = player.bench.some(b => b.cards.length > 0);
    const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!playerHasBench && !opponentHasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let targets = [];
    if (opponentHasBench) {
        yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
            targets = results || [];
            next();
        });
        if (targets.length > 0) {
            opponent.active.clearEffects();
            opponent.switchPokemon(targets[0]);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
    }
    if (playerHasBench) {
        yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
            targets = results || [];
            next();
        });
        if (targets.length > 0) {
            player.active.clearEffects();
            player.switchPokemon(targets[0]);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class EscapeRope extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLS';
        this.name = 'Escape Rope';
        this.fullName = 'Escape Rope PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.text = 'Each player switches his or her Active Pokemon with 1 of his or her ' +
            'Benched Pokemon. (Your opponent switches first. If a player does not ' +
            'have a Benched Pokemon, he or she doesn\'t switch Pokemon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EscapeRope = EscapeRope;
