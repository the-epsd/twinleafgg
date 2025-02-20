"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonReversal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class PokemonReversal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UF';
        this.name = 'Pokemon Reversal';
        this.fullName = 'Pokemon Reversal UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with your opponent\'s Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benchCount = opponent.bench.reduce((sum, b) => {
                return sum + (b.cards.length > 0 ? 1 : 0);
            }, 0);
            if (benchCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            opponent.active.clearEffects();
                            opponent.switchPokemon(targets[0]);
                            return state;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.PokemonReversal = PokemonReversal;
