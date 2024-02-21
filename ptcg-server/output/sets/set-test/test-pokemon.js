"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPokemon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 1000;
        this.weakness = [{ type: card_types_1.CardType.COLORLESS }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Put Energy On Bench',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'You may attach up to 2 Basic Energy from your discard pile to your Benched Pokémon in any way you like.',
                effect: (store, state, effect) => {
                }
            }
        ];
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Test';
        this.fullName = 'Test TEST';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
            prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
        }
        return state;
    }
}
exports.TestPokemon = TestPokemon;
