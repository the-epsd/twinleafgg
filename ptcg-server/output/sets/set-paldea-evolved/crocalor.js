"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crocalor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Crocalor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fuecoco';
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Steady Firebreathing',
                cost: [R],
                damage: 30,
                text: ''
            },
            {
                name: 'Hyper Voice',
                cost: [R, R],
                damage: 70,
                text: ''
            },
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Crocalor';
        this.fullName = 'Crocalor PAL';
    }
}
exports.Crocalor = Crocalor;
