"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crabrawler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Crabrawler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Vise Grip', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 20, text: '' },
            { name: 'Crabhammer', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 50, text: '' }
        ];
        this.set = 'SCR';
        this.name = 'Crabrawler';
        this.fullName = 'Crabrawler SCR';
        this.setNumber = '87';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Crabrawler = Crabrawler;
