"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dartrix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dartrix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Rowlet';
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [card_types_1.CardType.GRASS],
                damage: 40,
                text: ''
            }];
        this.set = 'SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Dartrix';
        this.fullName = 'Dartrix SHF';
    }
}
exports.Dartrix = Dartrix;
