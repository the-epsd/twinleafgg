"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosTadbulb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class IonosTadbulb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tiny Charge',
                cost: [L, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '29';
        this.name = 'Iono\'s Tadbulb';
        this.fullName = 'Iono\'s Tadbulb SV9';
    }
}
exports.IonosTadbulb = IonosTadbulb;
