"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensBeldum = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
class StevensBeldum extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STEVENS];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{ name: 'Metal Slash', cost: [M, C], damage: 30, text: '' }];
        this.regulationMark = 'I';
        this.set = 'SVOD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Steven\'s Beldum';
        this.fullName = 'Steven\'s Beldum SVOD';
    }
}
exports.StevensBeldum = StevensBeldum;
