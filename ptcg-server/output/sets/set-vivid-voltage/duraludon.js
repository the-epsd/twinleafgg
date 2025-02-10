"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duraludon = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Duraludon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Raging Claws',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Power Blast',
                cost: [M, M, C],
                damage: 120,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'D';
        this.set = 'VIV';
        this.setNumber = '129';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Duraludon';
        this.fullName = 'Duraludon VIV';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage += effect.player.active.damage;
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
            return state;
        }
        return state;
    }
}
exports.Duraludon = Duraludon;
