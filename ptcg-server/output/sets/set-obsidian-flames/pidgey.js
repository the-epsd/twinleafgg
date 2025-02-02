"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pidgey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.attacks = [
            { name: 'Gust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: '' },
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Pidgey';
        this.fullName = 'Pidgey OBF';
    }
}
exports.Pidgey = Pidgey;
