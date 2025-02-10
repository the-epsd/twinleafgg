"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ducklett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ducklett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flap',
                cost: [C],
                damage: 20,
                text: ''
            },
        ];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.setNumber = '148';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett DAA';
    }
}
exports.Ducklett = Ducklett;
