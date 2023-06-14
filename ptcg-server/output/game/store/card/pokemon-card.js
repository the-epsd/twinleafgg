"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCard = void 0;
const card_1 = require("./card");
const card_types_1 = require("./card-types");
class PokemonCard extends card_1.Card {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.POKEMON;
        this.cardType = card_types_1.CardType.NONE;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.stage = card_types_1.Stage.BASIC;
        this.retreat = [];
        this.hp = 0;
        this.weakness = [];
        this.resistance = [];
        this.powers = [];
        this.attacks = [];
    }
}
exports.PokemonCard = PokemonCard;
