"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Yanma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.attacks = [{
                name: 'Speed Dive',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Yanma ASR';
        this.name = 'Yanma';
        this.setNumber = '6';
    }
}
exports.Yanma = Yanma;
