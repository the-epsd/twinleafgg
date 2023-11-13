"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokegear30 = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Pokegear30 extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.set2 = 'scarletviolet';
        this.setNumber = '186';
        this.name = 'Pokegear 3.0';
        this.fullName = 'Pokegear SVI';
        this.text = 'Look at the top 7 cards of your deck. You may reveal a Supporter card ' +
            'you find there and put it into your hand. Shuffle the other cards back ' +
            'into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Heal each Pokemon by 10 damage
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
            return state;
        }
        return state;
    }
}
exports.Pokegear30 = Pokegear30;
