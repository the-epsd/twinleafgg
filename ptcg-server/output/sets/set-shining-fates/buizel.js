"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buizel = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Buizel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.attacks = [
            {
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'E';
        this.set = 'SHF';
        this.name = 'Buizel';
        this.setNumber = '22';
        this.fullName = 'Buizel SHF';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Buizel = Buizel;
