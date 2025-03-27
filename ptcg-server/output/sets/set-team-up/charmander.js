"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charmander extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [R],
                damage: 10,
                text: ''
            },
            {
                name: 'Reprisal',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            },
        ];
        this.set = 'TEU';
        this.name = 'Charmander';
        this.fullName = 'Charmander TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.damage = effect.player.active.damage * 2;
            return state;
        }
        return state;
    }
}
exports.Charmander = Charmander;
