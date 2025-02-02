"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horsea = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Horsea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hold Still',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Fin Cutter',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Horsea';
        this.fullName = 'Horsea SV6a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
        }
        return state;
    }
}
exports.Horsea = Horsea;
