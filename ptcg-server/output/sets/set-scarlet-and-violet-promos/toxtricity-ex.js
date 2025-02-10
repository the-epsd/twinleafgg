"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxtricityex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Toxtricityex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toxel';
        this.cardType = L;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Strumming Thunder',
                cost: [L, L, C],
                damage: 240,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'SVP';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '215';
        this.name = 'Toxtricity ex';
        this.fullName = 'Toxtricity ex SVP';
    }
    reduceEffect(store, state, effect) {
        // Strumming Thunder
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
        }
        return state;
    }
}
exports.Toxtricityex = Toxtricityex;
