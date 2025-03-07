"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianQwilfish2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HisuianQwilfish2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Spiny Rush',
                cost: [],
                damage: 10,
                text: 'Flip a coin until you get tails. This attack does 10 damage for each heads. '
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hisuian Qwilfish';
        this.fullName = 'Hisuian Qwilfish2 ASR';
        this.COIN_FLIP_TAILS = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    effect.damage = 10 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.HisuianQwilfish2 = HisuianQwilfish2;
