"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanRattata = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class AlolanRattata extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Gnaw',
                cost: [],
                damage: 20,
                text: ''
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Alolan Rattata';
        this.fullName = 'Alolan Rattata SUM';
    }
}
exports.AlolanRattata = AlolanRattata;
