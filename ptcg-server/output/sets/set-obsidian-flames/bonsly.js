"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bonsly = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bonsly extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 30;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [
            { name: 'Blubbering', cost: [], damage: 10, text: 'Your opponent\'s Active Pokémon is now Confused.' },
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Bonsly';
        this.fullName = 'Bonsly OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
        return state;
    }
}
exports.Bonsly = Bonsly;
