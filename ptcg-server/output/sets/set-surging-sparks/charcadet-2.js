"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charcadet2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Charcadet2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Light Punch',
                cost: [R],
                damage: 10,
                text: ''
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 70,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Charcadet';
        this.fullName = 'Charcadet 2 SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Charcadet2 = Charcadet2;
