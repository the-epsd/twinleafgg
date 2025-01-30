"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fennekin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Fennekin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Will-O-Wisp',
                cost: [R],
                damage: 20,
                text: '   '
            }
        ];
        this.set = 'XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Fennekin';
        this.fullName = 'Fennekin XY';
    }
}
exports.Fennekin = Fennekin;
