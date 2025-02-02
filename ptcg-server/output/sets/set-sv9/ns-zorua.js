"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsZorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class NsZorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.NS];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [D],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'N\'s Zorua';
        this.fullName = 'N\'s Zorua SV9';
    }
}
exports.NsZorua = NsZorua;
