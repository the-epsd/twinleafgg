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
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: '',
            },
            {
                name: 'Ember',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Discard 1 R Energy card attached to Charmander in order to use this attack.',
                effect: (store, state, effect) => {
                    prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.FIRE, 1);
                }
            },
        ];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Charmander';
        this.fullName = 'Charmander BS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.FIRE, 1);
        }
        return state;
    }
}
exports.Charmander = Charmander;
