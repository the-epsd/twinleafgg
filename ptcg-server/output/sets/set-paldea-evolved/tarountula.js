"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tarountula = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Tarountula extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hook',
                cost: [G, G],
                damage: 40,
                text: ''
            }];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Tarountula';
        this.fullName = 'Tarountula PAL';
    }
}
exports.Tarountula = Tarountula;
