"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicnicBasket = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class PicnicBasket extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '184';
        this.name = 'Picnic Basket';
        this.fullName = 'Picnic Basket SVI';
        this.text = 'Heal 30 damage from each Pokémon (both yours and your opponent\'s).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Heal each Pokemon by 30 damage
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                state = store.reduceEffect(state, healEffect);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                state = store.reduceEffect(state, healEffect);
            });
            player.supporter.moveCardTo(this, player.discard);
            return state;
        }
        return state;
    }
}
exports.PicnicBasket = PicnicBasket;
