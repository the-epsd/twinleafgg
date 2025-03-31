"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drilbur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Drilbur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dig Claws',
                cost: [F],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Drilbur';
        this.fullName = 'Drilbur UNM';
    }
}
exports.Drilbur = Drilbur;
