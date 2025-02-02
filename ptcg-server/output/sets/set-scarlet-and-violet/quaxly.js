"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxly = void 0;
const game_1 = require("../../game");
class Quaxly extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pound',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Kick',
                cost: [W, C],
                damage: 20,
                text: ''
            },
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quaxly';
        this.fullName = 'Quaxly SVI';
    }
}
exports.Quaxly = Quaxly;
