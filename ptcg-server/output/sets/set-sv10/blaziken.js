"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blaziken = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blaziken extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Combusken';
        this.cardType = R;
        this.hp = 170;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Heat Blast',
                cost: [C, C],
                damage: 70,
                text: ''
            },
            {
                name: 'Inferno Legs',
                cost: [R, R, C],
                damage: 120,
                text: 'Discard 2 Energy from this Pokémon, and this attack also does 120 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Blaziken';
        this.fullName = 'Blaziken SV10';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(120, effect, store, state);
        }
        return state;
    }
}
exports.Blaziken = Blaziken;
