"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesMorgrem = void 0;
const game_1 = require("../../game");
class MarniesMorgrem extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marnie\'s Impidimp';
        this.tags = [game_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Corkscrew Punch', cost: [D, D], damage: 60, text: '' },
        ];
        this.regulationMark = 'I';
        this.set = 'SVOM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Marnie\'s Morgrem';
        this.fullName = 'Marnie\'s Morgrem SVOM';
    }
}
exports.MarniesMorgrem = MarniesMorgrem;
