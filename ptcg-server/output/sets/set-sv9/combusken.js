"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combusken = void 0;
const game_1 = require("../../game");
class Combusken extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Torchic';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Slash',
                cost: [R, C],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SVM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Combusken';
        this.fullName = 'Combusken SVM';
    }
}
exports.Combusken = Combusken;
