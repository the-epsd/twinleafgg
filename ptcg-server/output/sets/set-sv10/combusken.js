"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combusken = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Combusken extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Torchic';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Combustion',
                cost: [R],
                damage: 20,
                text: ''
            },
            {
                name: 'Double Kick',
                cost: [R, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage for each heads.'
            },
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Combusken';
        this.fullName = 'Combusken SV10';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            let heads = 0;
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            effect.damage = 40 * heads;
        }
        return state;
    }
}
exports.Combusken = Combusken;
