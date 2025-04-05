"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Surf', cost: [C, C, C], damage: 60, text: '' }
        ];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer JTG';
    }
}
exports.Wailmer = Wailmer;
