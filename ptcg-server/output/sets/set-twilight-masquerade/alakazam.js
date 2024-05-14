"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazam = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Alakazam extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Strange Hack',
                cost: [],
                damage: 0,
                text: ''
            },
            {
                name: 'Psychic',
                cost: [],
                damage: 0,
                text: ''
            },
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Alakazam';
        this.fullName = 'Alakazam SV6';
    }
}
exports.Alakazam = Alakazam;
