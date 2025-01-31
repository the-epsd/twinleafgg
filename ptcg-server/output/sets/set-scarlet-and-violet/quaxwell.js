"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxwell = void 0;
const game_1 = require("../../game");
class Quaxwell extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Quaxly';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rain Splash',
                cost: [W],
                damage: 20,
                text: ''
            },
            {
                name: 'Spiral Kick',
                cost: [W, C, C],
                damage: 70,
                text: ''
            },
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quaxwell';
        this.fullName = 'Quaxwell SVI';
    }
}
exports.Quaxwell = Quaxwell;
