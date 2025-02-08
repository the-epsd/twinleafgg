"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackKyuremEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class BlackKyuremEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = N;
        this.hp = 180;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Slash', cost: [C, C, C], damage: 60, text: '' },
            {
                name: 'Black Ballista',
                cost: [W, W, L, C],
                damage: 200,
                text: 'Discard 3 Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PLS';
        this.name = 'Black Kyurem EX';
        this.fullName = 'Black Kyurem EX PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this))
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
        return state;
    }
}
exports.BlackKyuremEX = BlackKyuremEX;
