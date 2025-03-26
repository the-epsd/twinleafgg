"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bisharp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Metal Claw',
                cost: [M],
                damage: 20,
                text: ''
            },
            {
                name: 'Fury Cutter',
                cost: [M, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip 3 coins. If 1 of them is heads, this attack does 20 more damage. If 2 of them are heads, this attack does 60 more damage. If all of them are heads, this attack does 120 more damage.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp OBF';
    }
    reduceEffect(store, state, effect) {
        // Fury Cutter
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            let heads = 0;
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            switch (heads) {
                case 1:
                    effect.damage += 20;
                    break;
                case 2:
                    effect.damage += 60;
                    break;
                case 3:
                    effect.damage += 120;
                    break;
                default:
                    effect.damage += 0;
                    break;
            }
        }
        return state;
    }
}
exports.Bisharp = Bisharp;
