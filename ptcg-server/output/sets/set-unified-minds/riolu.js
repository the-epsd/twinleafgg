"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Riolu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Riolu';
        this.set = 'UNM';
        this.fullName = 'Riolu UNM';
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.hp = 60;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Kick',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }
        ];
    }
}
exports.Riolu = Riolu;
