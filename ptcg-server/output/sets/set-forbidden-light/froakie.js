"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froakie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
// FLI Froakie 22 (https://limitlesstcg.com/cards/FLI/22)
class Froakie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Rain Splash', cost: [card_types_1.CardType.WATER], damage: 10, text: '' },
            { name: 'Wave Splash', cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'FLI';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Froakie';
        this.fullName = 'Froakie FLI';
    }
}
exports.Froakie = Froakie;
