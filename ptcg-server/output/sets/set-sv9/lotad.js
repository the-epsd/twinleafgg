"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lotad = void 0;
const game_1 = require("../../game");
class Lotad extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Water Gun', cost: [W], damage: 20, text: '' },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Lotad';
        this.fullName = 'Lotad SV9';
    }
}
exports.Lotad = Lotad;
