"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VigorothSSP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class VigorothSSP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slakoth';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Slashing Claw', cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 50, text: '' }
        ];
        this.set = 'SVI';
        this.setNumber = '146';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Vigoroth';
        this.fullName = 'Vigoroth SSP';
    }
}
exports.VigorothSSP = VigorothSSP;
