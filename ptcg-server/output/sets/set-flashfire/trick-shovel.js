"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrickShovel = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TrickShovel extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Trick Shovel';
        this.fullName = 'Trick Shovel FLF';
        this.text = 'Look at the top card of either player\'s deck. You may discard that card or return it to the top of the deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.SELECT_PROMPT_WITH_OPTIONS(store, state, player, [{
                    message: game_1.GameMessage.REVEAL_YOUR_TOP_DECK,
                    action: () => prefabs_1.LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, player),
                },
                {
                    message: game_1.GameMessage.REVEAL_OPPONENT_TOP_DECK,
                    action: () => prefabs_1.LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, player, opponent),
                }]);
        }
        return state;
    }
}
exports.TrickShovel = TrickShovel;
