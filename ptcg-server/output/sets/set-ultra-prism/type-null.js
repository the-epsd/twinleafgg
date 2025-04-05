"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeNull = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TypeNull extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Merciless Stike',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 30 more damage. '
            },
            {
                name: 'Headbang',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Type: Null';
        this.fullName = 'Type: Null UPR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.opponent.active.damage > 0) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.TypeNull = TypeNull;
