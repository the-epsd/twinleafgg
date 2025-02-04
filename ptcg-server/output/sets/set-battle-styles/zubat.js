"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hide in Shadows',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Speed Dive',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zubat';
        this.fullName = 'Zubat BST';
        this.usedHideInShadows = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedHideInShadows = true;
        }
        if (prefabs_1.AFTER_ATTACK(effect) && this.usedHideInShadows) {
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            this.usedHideInShadows = false;
        }
        return state;
    }
}
exports.Zubat = Zubat;
