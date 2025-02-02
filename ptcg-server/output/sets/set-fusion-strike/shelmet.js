"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shelmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spit Beam',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Shelmet';
        this.fullName = 'Shelmet FST';
    }
}
exports.Shelmet = Shelmet;
