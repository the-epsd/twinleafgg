"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCatcher = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let coinResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
        coinResult = result;
        next();
    });
    if (coinResult === false) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
}
class PokemonCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '187';
        this.name = 'Pokemon Catcher';
        this.fullName = 'Pokemon Catcher SVI';
        this.text = 'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon ' +
            'with their Active Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokemonCatcher = PokemonCatcher;
