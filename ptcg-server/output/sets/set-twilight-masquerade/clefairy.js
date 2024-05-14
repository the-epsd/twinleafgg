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
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Moon Kick',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy SV6';
    }
}
exports.Clefairy = Clefairy;
