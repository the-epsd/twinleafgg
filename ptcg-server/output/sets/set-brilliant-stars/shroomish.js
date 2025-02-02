"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shroomish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shroomish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Headbutt', cost: [G], damage: 20, text: '' }
        ];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Shroomish';
        this.fullName = 'Shroomish BRS';
    }
}
exports.Shroomish = Shroomish;
