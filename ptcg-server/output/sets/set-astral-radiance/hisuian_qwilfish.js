"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianQwilfish2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class HisuianQwilfish2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Rolling Tackle',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'ASR';
        this.setNumber = '88';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hisuian Qwilfish';
        this.fullName = 'Hisuian Qwilfish ASR';
    }
}
exports.HisuianQwilfish2 = HisuianQwilfish2;
