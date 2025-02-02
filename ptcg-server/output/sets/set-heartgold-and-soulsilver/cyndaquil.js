"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cyndaquil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Cyndaquil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Beat', cost: [card_types_1.CardType.FIRE], damage: 10, text: '' },
            { name: 'Flare', cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'HS';
        this.name = 'Cyndaquil';
        this.fullName = 'Cyndaquil HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
}
exports.Cyndaquil = Cyndaquil;
