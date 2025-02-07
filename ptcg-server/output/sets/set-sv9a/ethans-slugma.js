"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansSlugma = void 0;
const game_1 = require("../../game");
class EthansSlugma extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ETHANS];
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Steady Firebreathing',
                cost: [R],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Ethan\'s Slugma';
        this.fullName = 'Ethan\'s Slugma SV9a';
    }
}
exports.EthansSlugma = EthansSlugma;
