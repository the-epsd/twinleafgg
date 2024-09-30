"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shellder = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shellder extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Toungue Slap',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
            {
                name: 'Wave Splash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Shellder';
        this.fullName = 'Shellder FST';
    }
}
exports.Shellder = Shellder;
