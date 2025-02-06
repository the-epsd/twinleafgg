"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glimmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Glimmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rock Throw',
                cost: [F],
                damage: 20,
                text: ''
            }];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.setNumber = '125';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glimmet';
        this.fullName = 'Glimmet PAL';
    }
}
exports.Glimmet = Glimmet;
