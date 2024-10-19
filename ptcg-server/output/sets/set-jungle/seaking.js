"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seaking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Seaking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Goldeen';
        this.attacks = [{
                name: 'Horn Attack',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
            {
                name: 'Waterfall',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Seaking';
        this.fullName = 'Seaking JU';
    }
}
exports.Seaking = Seaking;
