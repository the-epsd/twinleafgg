"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Petilil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Petilil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Leaf Step',
                cost: [G, C],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Petilil';
        this.fullName = 'Petilil SV9';
    }
}
exports.Petilil = Petilil;
