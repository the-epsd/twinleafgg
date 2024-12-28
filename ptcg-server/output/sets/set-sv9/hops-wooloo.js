"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsWooloo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class HopsWooloo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOPS];
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smash Kick',
                cost: [C, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Hop\'s Wooloo';
        this.fullName = 'Hop\'s Wooloo SV9';
    }
}
exports.HopsWooloo = HopsWooloo;
