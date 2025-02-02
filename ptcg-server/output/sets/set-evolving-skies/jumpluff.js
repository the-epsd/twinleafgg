"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.powers = [{
                name: 'Fluffy Barrage',
                powerType: game_1.PowerType.ABILITY,
                barrage: true,
                text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon,'
                    + ' you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff EVS';
    }
}
exports.Jumpluff = Jumpluff;
