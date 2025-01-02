"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefairy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Clefairy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = P;
        this.weakness = [{ type: M }];
        this.hp = 60;
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Moon Kick',
                cost: [C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy TWM';
    }
}
exports.Clefairy = Clefairy;
