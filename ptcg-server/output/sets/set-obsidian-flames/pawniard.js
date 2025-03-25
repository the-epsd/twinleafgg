"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawniard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pawniard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Triple Cutter',
                cost: [M],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage for each heads.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Pawniard';
        this.fullName = 'Pawniard OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
            effect.damage = heads * 10;
        }
        return state;
    }
}
exports.Pawniard = Pawniard;
