"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackKyurem = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BlackKyurem extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dual Claw',
                cost: [L, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.',
            },
            {
                name: 'Flash Freeze',
                cost: [W, L, C, C],
                damage: 100,
                text: 'Discard an Energy attached to this Pokémon.'
            },
        ];
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Black Kyurem';
        this.fullName = 'Black Kyurem BCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
                effect.damage = 20 * results.filter(r => r === true).length;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.BlackKyurem = BlackKyurem;
