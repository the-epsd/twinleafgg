"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianLinoone = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class GalarianLinoone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.evolvesFrom = 'Galarian Zigzagoon';
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rear Kick',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Galarian Linoone';
        this.fullName = 'Galarian Linoone FST';
    }
}
exports.GalarianLinoone = GalarianLinoone;
