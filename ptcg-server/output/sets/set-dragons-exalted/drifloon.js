"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifloon = void 0;
const game_1 = require("../../game");
class Drifloon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Beat', cost: [C], damage: 10, text: '' },
            { name: 'Gust', cost: [P, C], damage: 20, text: '' },
        ];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Drifloon';
        this.fullName = 'Drifloon DRX';
    }
}
exports.Drifloon = Drifloon;
