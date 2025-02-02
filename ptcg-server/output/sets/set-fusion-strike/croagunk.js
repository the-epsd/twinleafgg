"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croagunk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Croagunk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Corkscrew Punch',
                cost: [card_types_1.CardType.DARK],
                damage: 20,
                text: ''
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Croagunk';
        this.fullName = 'Croagunk FST';
    }
}
exports.Croagunk = Croagunk;
