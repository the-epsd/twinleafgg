"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsCorvisquire = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class HopsCorvisquire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hop\'s Rookidee';
        this.tags = [card_types_1.CardTag.HOPS];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Speed Dive', cost: [C], damage: 30, text: '' },
            { name: 'Razor Wing', cost: [C, C, C], damage: 80, text: '' },
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Hop\'s Corvisquire';
        this.fullName = 'Hop\'s Corvisquire SV9';
    }
}
exports.HopsCorvisquire = HopsCorvisquire;
