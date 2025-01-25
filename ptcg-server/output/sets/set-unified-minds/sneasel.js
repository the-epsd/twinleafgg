"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slash',
                cost: [D, C],
                damage: 30,
                text: ''
            }];
        this.set = 'UNM';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel UNM';
        this.setNumber = '131';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Sneasel = Sneasel;
