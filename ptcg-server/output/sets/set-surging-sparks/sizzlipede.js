"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sizzlipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sizzlipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Live Coal', cost: [R], damage: 10, text: '' },
            { name: 'Hook', cost: [C, C, C], damage: 30, text: '' },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Sizzlipede';
        this.fullName = 'Sizzlipede SSP';
    }
}
exports.Sizzlipede = Sizzlipede;
