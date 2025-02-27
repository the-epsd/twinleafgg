"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Vanillite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Chilly',
                cost: [W, W],
                damage: 40,
                text: ''
            }];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Vanillite';
        this.fullName = 'Vanillite PAR';
    }
}
exports.Vanillite = Vanillite;
