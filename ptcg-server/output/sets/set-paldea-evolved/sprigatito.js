"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprigatito = void 0;
const game_1 = require("../../game");
class Sprigatito extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 70;
        this.retreat = [game_1.CardType.COLORLESS];
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.attacks = [
            {
                name: 'Dig Claws',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.name = 'Sprigatito';
        this.fullName = 'Sprigatito PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.regulationMark = 'G';
        // Additional methods and logic can be added here
    }
}
exports.Sprigatito = Sprigatito;
