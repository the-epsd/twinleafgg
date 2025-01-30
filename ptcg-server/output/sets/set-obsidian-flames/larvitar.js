"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Larvitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Corkscrew Punch',
                cost: [F],
                damage: 10,
                text: '',
            },
            {
                name: 'Confront',
                cost: [F, F],
                damage: 30,
                text: '',
            },
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Larvitar';
        this.fullName = 'Larvitar OBF';
    }
}
exports.Larvitar = Larvitar;
