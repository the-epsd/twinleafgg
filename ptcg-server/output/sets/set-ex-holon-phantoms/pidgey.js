"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pidgey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [C],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'HP';
        this.name = 'Pidgey';
        this.fullName = 'Pidgey HP';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Pidgey = Pidgey;
