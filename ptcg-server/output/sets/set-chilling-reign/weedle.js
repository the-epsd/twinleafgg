"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeedleCRE = void 0;
const game_1 = require("../../game");
class WeedleCRE extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.SINGLE_STRIKE];
        this.cardType = game_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'CRE';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'E';
        this.name = 'Weedle';
        this.fullName = 'Weedle CRE';
        this.attacks = [{ name: 'Pierce', cost: [game_1.CardType.GRASS], damage: 20, text: '' }];
    }
}
exports.WeedleCRE = WeedleCRE;
