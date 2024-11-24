"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pansear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Combustion', cost: [R], damage: 20, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Pansear';
        this.fullName = 'Pansear SSP';
        this.regulationMark = 'H';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Pansear = Pansear;
