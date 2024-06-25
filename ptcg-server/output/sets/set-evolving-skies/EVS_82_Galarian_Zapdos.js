"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianZapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class GalarianZapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Galarian Zapdos';
        this.fullName = 'Galarian Zapdos EVS';
    }
}
exports.GalarianZapdos = GalarianZapdos;
