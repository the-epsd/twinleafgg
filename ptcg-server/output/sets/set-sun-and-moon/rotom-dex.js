"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotomDex = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RotomDex extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'SUM';
        this.name = 'Rotom Dex';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.fullName = 'Rotom Dex SUM';
        this.text = 'After counting your Prize cards, shuffle them into your deck. Then, take that many cards from the top of your deck and put them face down as your Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const prizeCount = prefabs_1.GET_PLAYER_PRIZES(player).length;
            if (prizeCount === 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            prefabs_1.SHUFFLE_PRIZES_INTO_DECK(store, state, player);
            prefabs_1.DRAW_CARDS_AS_FACE_DOWN_PRIZES(player, prizeCount);
            prefabs_1.MOVE_CARD_TO(state, this, player.discard);
            return state;
        }
        return state;
    }
}
exports.RotomDex = RotomDex;
