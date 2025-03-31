"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Torchic extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Combustion',
                cost: [R],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Torchic';
        this.fullName = 'Torchic SV10';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 1);
        }
        return state;
    }
}
exports.Torchic = Torchic;
