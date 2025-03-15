"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoppip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.attacks = [{
                name: 'Continuous Spin',
                cost: [G],
                damage: 10,
                damageCalculationn: 'x',
                text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip EVS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
exports.Hoppip = Hoppip;
