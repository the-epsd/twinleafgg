"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pupitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pupitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvitar';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Headbutt Bounce',
                cost: [C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Pupitar';
        this.fullName = 'Pupitar PAL';
    }
}
exports.Pupitar = Pupitar;
