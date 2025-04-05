"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diglett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Diglett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 40;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [{
                name: 'Ram',
                cost: [F],
                damage: 10,
                text: ''
            }];
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Diglett';
        this.fullName = 'Diglett FCO';
    }
}
exports.Diglett = Diglett;
