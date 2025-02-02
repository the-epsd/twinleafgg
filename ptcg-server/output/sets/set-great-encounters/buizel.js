"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buizel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Buizel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING,
                value: 10
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Headbutt', cost: [], damage: 10, text: '' },
            { name: 'Surf', cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER], damage: 30, text: '' }
        ];
        this.set = 'GE';
        this.name = 'Buizel';
        this.fullName = 'Buizel GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
}
exports.Buizel = Buizel;
