"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Scraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Low Kick',
                cost: [C],
                damage: 10,
                text: ''
            }, {
                name: 'Headstrike',
                cost: [D, D, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAF';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy PAF';
    }
}
exports.Scraggy = Scraggy;
