"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milcery = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Milcery extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mumble',
                cost: [P],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Milcery';
        this.fullName = 'Milcery SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
    }
}
exports.Milcery = Milcery;
