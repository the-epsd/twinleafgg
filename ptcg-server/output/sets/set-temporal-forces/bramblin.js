"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bramblin = void 0;
const game_1 = require("../../game");
class Bramblin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Spike Sting', cost: [C, C], damage: 30, text: '' },
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Bramblin';
        this.fullName = 'Bramblin TEF';
    }
}
exports.Bramblin = Bramblin;
