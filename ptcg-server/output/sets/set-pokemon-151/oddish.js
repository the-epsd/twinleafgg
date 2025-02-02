"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oddish = void 0;
const game_1 = require("../../game");
class Oddish extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Oddish';
        this.fullName = 'Oddish MEW';
    }
}
exports.Oddish = Oddish;
