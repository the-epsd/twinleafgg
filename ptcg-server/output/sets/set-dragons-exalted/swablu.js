"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swablu = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swablu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Sing', cost: [C], damage: 0, text: 'The Defending Pokémon is now Asleep.' },
            { name: 'Peck', cost: [C, C], damage: 20, text: '' },
        ];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Swablu';
        this.fullName = 'Swablu DRX';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
        return state;
    }
}
exports.Swablu = Swablu;
