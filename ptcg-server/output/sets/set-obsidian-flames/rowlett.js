"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowletOBF = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class RowletOBF extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Razor Wing', cost: [card_types_1.CardType.GRASS], damage: 20, text: '' }
        ];
        this.regulationMark = 'H';
        this.set = 'OBF';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rowlet';
        this.fullName = 'Rowlet OBF';
    }
}
exports.RowletOBF = RowletOBF;
