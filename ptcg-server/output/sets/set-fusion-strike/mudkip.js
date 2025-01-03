"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mudkip = void 0;
const game_1 = require("../../game");
class Mudkip extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mud Slap',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Playful Kick',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Mudkip';
        this.fullName = 'Mudkip FST';
    }
}
exports.Mudkip = Mudkip;
