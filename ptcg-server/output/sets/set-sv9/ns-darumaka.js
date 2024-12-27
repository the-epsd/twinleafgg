"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsDarumaka = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class NsDarumaka extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rolling Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Flare',
                cost: [R, R, C],
                damage: 50,
                text: ''
            },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '15';
        this.name = 'N\'s Darumaka';
        this.fullName = 'N\'s Darumaka SV9';
    }
}
exports.NsDarumaka = NsDarumaka;
