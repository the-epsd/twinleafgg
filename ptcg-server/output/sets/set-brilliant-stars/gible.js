"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gible = void 0;
const game_1 = require("../../game");
class Gible extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 70;
        this.retreat = [C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [W, R],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Gible';
        this.fullName = 'Gible BRS';
    }
}
exports.Gible = Gible;
