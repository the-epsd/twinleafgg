"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inkay = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Inkay extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.evolvesInto = 'Malamar';
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: ''
            }];
        this.set = 'CRE';
        this.name = 'Inkay';
        this.fullName = 'Inkay CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
    }
}
exports.Inkay = Inkay;
