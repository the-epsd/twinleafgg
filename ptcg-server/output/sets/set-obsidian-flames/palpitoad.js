"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palpitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Palpitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Tympole';
        this.attacks = [{
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 50,
                text: ''
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Palpitoad';
        this.fullName = 'Palpitoad OBF';
    }
}
exports.Palpitoad = Palpitoad;
