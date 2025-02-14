"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCard = void 0;
const card_marker_1 = require("../state/card-marker");
const card_1 = require("./card");
const card_types_1 = require("./card-types");
class PokemonCard extends card_1.Card {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.POKEMON;
        this.cardType = card_types_1.CardType.NONE;
        this.cardTag = [];
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.stage = card_types_1.Stage.BASIC;
        this.retreat = [];
        this.hp = 0;
        this.weakness = [];
        this.resistance = [];
        this.powers = [];
        this.attacks = [];
        this.format = card_types_1.Format.NONE;
        this.marker = new card_marker_1.Marker();
        this.movedToActiveThisTurn = false;
        this.tools = [];
        this.archetype = [];
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
    }
}
exports.PokemonCard = PokemonCard;
