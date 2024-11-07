"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandygast = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sandygast extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Sand Spray', cost: [C, C, C], damage: 50, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Sandygast';
        this.fullName = 'Sandygast SSP';
        this.regulationMark = 'H';
        this.setNumber = '90';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Sandygast = Sandygast;
