"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cutiefly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Cutiefly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 30;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.attacks = [{
                name: 'Fairy Wind',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Cutiefly';
        this.fullName = 'Cutiefly BUS';
    }
}
exports.Cutiefly = Cutiefly;
