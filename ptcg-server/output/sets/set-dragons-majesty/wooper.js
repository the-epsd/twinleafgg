"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wooper = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Wooper extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'DRM';
        this.fullName = 'Wooper DRM';
        this.name = 'Wooper';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Wooper = Wooper;
