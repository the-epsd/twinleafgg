"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.evolvesFrom = '';
        this.cardType = card_types_1.CardType.GRASS;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.hp = 90;
        this.retreat = [];
        this.powers = [{
                name: 'Fluffy Barrage',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff EVS';
    }
}
exports.Jumpluff = Jumpluff;
