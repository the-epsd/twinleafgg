"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetoddle = void 0;
const game_1 = require("../../game");
class Cetoddle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Gentle Slap',
                cost: [W, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Frost Smash',
                cost: [W, W, W, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Cetoddle';
        this.fullName = 'Cetoddle SV10';
    }
}
exports.Cetoddle = Cetoddle;
