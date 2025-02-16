"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasRoselia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class CynthiasRoselia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spike Sting',
                cost: [C],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Roselia';
        this.fullName = 'Cynthia\'s Roselia SV9a';
    }
}
exports.CynthiasRoselia = CynthiasRoselia;
