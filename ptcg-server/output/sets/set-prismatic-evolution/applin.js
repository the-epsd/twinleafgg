"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Applin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spray Fluid',
                cost: [G],
                damage: 20,
                text: '',
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Applin';
        this.fullName = 'Applin PRE';
    }
}
exports.Applin = Applin;
