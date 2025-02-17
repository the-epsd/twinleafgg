"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tympole = void 0;
const game_1 = require("../../game");
class Tympole extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Vibration', cost: [C], damage: 10, text: '' },
            { name: 'Mud Shot', cost: [W, C], damage: 20, text: '' },
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Tympole';
        this.fullName = 'Tympole NVI';
    }
}
exports.Tympole = Tympole;
