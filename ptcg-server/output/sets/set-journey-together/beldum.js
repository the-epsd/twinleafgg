"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beldum = void 0;
const game_1 = require("../../game");
class Beldum extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Spinning Attack', cost: [P], damage: 10, text: '' },
            { name: 'Beam', cost: [P, P], damage: 30, text: '' },
        ];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Beldum';
        this.fullName = 'Beldum JTG';
    }
}
exports.Beldum = Beldum;
