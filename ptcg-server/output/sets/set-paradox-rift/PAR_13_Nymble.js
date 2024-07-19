"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nymble = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Nymble extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.attacks = [{
                name: 'Gnaw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Nymble PAR';
        this.name = 'Nymble';
        this.setNumber = '13';
    }
}
exports.Nymble = Nymble;
