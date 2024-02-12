"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bronzor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.METAL],
                damage: 10,
                text: ''
            }];
        this.set = 'PHF';
        this.name = 'Bronzor';
        this.fullName = 'Bronzor PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
    }
}
exports.Bronzor = Bronzor;
