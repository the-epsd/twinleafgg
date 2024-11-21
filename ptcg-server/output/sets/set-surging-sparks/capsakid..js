"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capsakid = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Capsakid extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Headbutt Bounce', cost: [C, C], damage: 20, text: '' }
        ];
        this.set = 'SSP';
        this.name = 'Capsakid';
        this.fullName = 'Capsakid SSP';
        this.regulationMark = 'H';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Capsakid = Capsakid;
