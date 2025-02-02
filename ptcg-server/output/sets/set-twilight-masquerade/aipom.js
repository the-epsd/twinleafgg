"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Aipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hang Down',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Playful Kick',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Aipom';
        this.fullName = 'Aipom TWM';
    }
}
exports.Aipom = Aipom;
