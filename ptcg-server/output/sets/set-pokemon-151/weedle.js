"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const game_1 = require("../../game");
class Weedle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Ram', cost: [G], damage: 10, text: '' },
            { name: 'Bug Bite', cost: [C, C], damage: 20, text: '' },
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Weedle';
        this.fullName = 'Weedle MEW';
    }
}
exports.Weedle = Weedle;
