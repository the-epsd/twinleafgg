"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elgyem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Elgyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psybeam',
                cost: [P],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'UNM';
        this.name = 'Elgyem';
        this.fullName = 'Elgyem UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
        return state;
    }
}
exports.Elgyem = Elgyem;
