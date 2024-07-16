"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honedge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Honedge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Slicing Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.name = 'Honedge';
        this.fullName = 'Honedge RCL';
    }
}
exports.Honedge = Honedge;
