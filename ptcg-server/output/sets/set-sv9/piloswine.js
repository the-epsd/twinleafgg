"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piloswine = void 0;
const game_1 = require("../../game");
class Piloswine extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Swinub';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Strength',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Piercing Fangs',
                cost: [F, F],
                damage: 50,
                text: ''
            },
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Piloswine';
        this.fullName = 'Piloswine SV9';
    }
}
exports.Piloswine = Piloswine;
