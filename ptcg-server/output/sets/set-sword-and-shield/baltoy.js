"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Baltoy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Baltoy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Beam',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Sand Spray',
                cost: [F, F],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'SSH';
        this.name = 'Baltoy';
        this.fullName = 'Baltoy SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
    }
}
exports.Baltoy = Baltoy;
