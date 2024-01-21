"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class ForestSealStone extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.useWhenAttached = true;
        this.powers = [{
                name: 'Forest Seal Stone',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may search your deck for up to ' +
                    '2 cards and put them into your hand. Then, shuffle your ' +
                    'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
    }
}
exports.ForestSealStone = ForestSealStone;
