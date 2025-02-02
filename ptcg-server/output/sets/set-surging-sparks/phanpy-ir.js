"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Phanpy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Headbutt', cost: [F], damage: 20, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy SSP';
        this.regulationMark = 'H';
        this.setNumber = '205';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Phanpy = Phanpy;
