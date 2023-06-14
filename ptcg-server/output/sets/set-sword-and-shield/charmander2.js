"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charmander2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Gnaw', cost: [card_types_1.CardType.FIRE], damage: 10, text: '' },
            { name: 'Flare', cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS], damage: 20, text: '' }
        ];
        this.set = 'SSH';
        this.name = 'Charmander';
        this.fullName = 'Charmander PSSH';
    }
}
exports.Charmander2 = Charmander2;
