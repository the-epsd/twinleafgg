"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togepi = void 0;
const game_1 = require("../../game");
class Togepi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flutter',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Togepi';
        this.fullName = 'Togepi SV8';
    }
}
exports.Togepi = Togepi;
