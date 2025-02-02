"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Riolu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Low Kick', cost: [F, F], damage: 50, text: '' }
        ];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Riolu';
        this.fullName = 'Riolu BRS';
    }
}
exports.Riolu = Riolu;
