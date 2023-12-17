"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charmander extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Power Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 40,
                text: 'Discard an Energy from this Pokémon.',
                effect: (store, state, effect) => {
                    prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
                }
            },
        ];
        this.set = 'SVP';
        this.set2 = 'svpromos';
        this.setNumber = '47';
        this.name = 'Charmander';
        this.fullName = 'Charmander SVP';
    }
}
exports.Charmander = Charmander;
