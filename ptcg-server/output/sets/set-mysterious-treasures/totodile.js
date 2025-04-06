"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Totodile = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Totodile extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L, value: +10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [],
                damage: 10,
                text: ''
            },
            {
                name: 'Shining Fang',
                cost: [W],
                damage: 10,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has any damage counters on it, this attack does 10 damage plus 10 more damage.'
            },
        ];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Totodile';
        this.fullName = 'Totodile MT';
        this.SAND_PIT_MARKER = 'SAND_PIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
            }
        }
        return state;
    }
}
exports.Totodile = Totodile;
