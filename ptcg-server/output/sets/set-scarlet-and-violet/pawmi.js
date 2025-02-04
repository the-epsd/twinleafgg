"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawmi = void 0;
const game_1 = require("../../game");
class Pawmi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Light Punch', cost: [C], damage: 10, text: '' },
            { name: 'Zap Kick', cost: [L, C], damage: 20, text: '' },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Pawmi';
        this.fullName = 'Pawmi SVI';
    }
}
exports.Pawmi = Pawmi;
