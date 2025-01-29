"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pupitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pupitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvitar';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sand Spray',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Hammer In',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'PRE';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Pupitar';
        this.fullName = 'Pupitar PRE';
    }
}
exports.Pupitar = Pupitar;
