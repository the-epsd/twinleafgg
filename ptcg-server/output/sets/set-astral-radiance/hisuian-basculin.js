"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBasculin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianBasculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gather the Crew',
                cost: [],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.',
                effect: function (store, state, effect) {
                    prefabs_1.CHOOSE_CARDS_TO_PUT_ON_BENCH(store, state, effect, 0, 2, card_types_1.Stage.BASIC);
                }
            },
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '43';
        this.name = 'Hisuian Basculin';
        this.fullName = 'Hisuian Basculin ASR';
    }
}
exports.HisuianBasculin = HisuianBasculin;
