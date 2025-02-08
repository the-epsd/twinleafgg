"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwag = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poliwag extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Stampede', cost: [W], damage: 10, text: '' },
            {
                name: 'Tail Rap',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage for each heads.',
            },
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Poliwag';
        this.fullName = 'Poliwag TWM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
                effect.damage = 20 * results.reduce((sum, r) => (sum + (r ? 1 : 0)), 0);
            });
        }
        return state;
    }
}
exports.Poliwag = Poliwag;
