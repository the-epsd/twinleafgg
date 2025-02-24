"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feebas = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feebas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flail',
                cost: [W],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Feebas';
        this.fullName = 'Feebas TWM';
    }
    reduceEffect(store, state, effect) {
        // Flail
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage = effect.player.active.damage;
        }
        return state;
    }
}
exports.Feebas = Feebas;
