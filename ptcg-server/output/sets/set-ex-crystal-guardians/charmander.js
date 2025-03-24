"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charmander extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Bite',
                cost: [L, C],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'CG';
        this.name = 'Charmander';
        this.fullName = 'Charmander CG';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Charmander = Charmander;
