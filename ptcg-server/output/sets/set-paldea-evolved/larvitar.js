"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Larvitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Double Stab',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Larvitar';
        this.fullName = 'Larvitar PAL';
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
            effect.damage = heads * 10;
        }
        return state;
    }
}
exports.Larvitar = Larvitar;
