"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metang = void 0;
const game_1 = require("../../game");
class Metang extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Beldum';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Psypunch', cost: [P], damage: 30, text: '' },
            { name: 'Zen Headbutt', cost: [P, P], damage: 50, text: '' },
        ];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Metang';
        this.fullName = 'Metang JTG';
    }
}
exports.Metang = Metang;
