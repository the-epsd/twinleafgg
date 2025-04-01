"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ember',
                cost: [R],
                damage: 30,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Salandit';
        this.fullName = 'Salandit SCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Salandit = Salandit;
