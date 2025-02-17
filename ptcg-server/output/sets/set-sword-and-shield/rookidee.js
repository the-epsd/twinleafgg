"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rookidee = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Rookidee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flap',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Glide',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.name = 'Rookidee';
        this.fullName = 'Rookidee SSH';
    }
}
exports.Rookidee = Rookidee;
