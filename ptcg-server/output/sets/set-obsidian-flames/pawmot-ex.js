"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawmotex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pawmotex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pawmo';
        this.cardType = L;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.hp = 300;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            { name: 'Zap Kick', cost: [L], damage: 60, text: '' },
            {
                name: 'Levin Strike',
                cost: [L, L],
                damage: 0,
                text: 'Discard 2 [L] Energy from this Pokémon. This attack does 220 damage to 1 of your opponent\'s Pokémon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Pawmot ex';
        this.fullName = 'Pawmot ex OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, L, 2);
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(220, effect, store, state);
        }
        return state;
    }
}
exports.Pawmotex = Pawmotex;
