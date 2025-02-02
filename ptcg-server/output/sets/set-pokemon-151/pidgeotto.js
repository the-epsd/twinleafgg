"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.attacks = [
            { name: 'Flap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: '' },
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Pidgeotto';
        this.fullName = 'Pidgeotto MEW';
    }
}
exports.Pidgeotto = Pidgeotto;
