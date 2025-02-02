"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litleo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Litleo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'FLF';
        this.name = 'Litleo';
        this.fullName = 'Litleo FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
    }
}
exports.Litleo = Litleo;
