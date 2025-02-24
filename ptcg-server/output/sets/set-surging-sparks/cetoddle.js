"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetoddle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cetoddle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Draining Fin',
                cost: [W, C],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cetoddle';
        this.fullName = 'Cetoddle SSP';
    }
    reduceEffect(store, state, effect) {
        // Draining Fin
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
        }
        return state;
    }
}
exports.Cetoddle = Cetoddle;
