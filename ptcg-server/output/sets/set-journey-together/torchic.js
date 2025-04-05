"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic = void 0;
const game_1 = require("../../game");
class Torchic extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [R, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Torchic';
        this.fullName = 'Torchic JTG';
    }
}
exports.Torchic = Torchic;
