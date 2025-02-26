"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pound',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Eerie Wave',
                cost: [P, C],
                damage: 20,
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            },
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Gothita';
        this.fullName = 'Gothita PAL';
    }
    reduceEffect(store, state, effect) {
        // Eerie Wave
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Gothita = Gothita;
