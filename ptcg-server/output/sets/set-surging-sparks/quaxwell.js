"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaxwell = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Quaxwell extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = W;
        this.evolvesFrom = 'Quaxly';
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Aqua Edge', cost: [W], damage: 40, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Quaxwell';
        this.fullName = 'Quaxwell SSP';
        this.regulationMark = 'H';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Quaxwell = Quaxwell;
