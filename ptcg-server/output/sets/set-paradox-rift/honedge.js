"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honedge = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Honedge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Cut Up',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                text: ''
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Honedge';
        this.fullName = 'Honedge PAR';
    }
}
exports.Honedge = Honedge;
