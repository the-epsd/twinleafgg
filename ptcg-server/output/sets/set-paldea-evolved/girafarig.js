"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Girafarig = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Girafarig extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Psy Bolt',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Headbang',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.setNumber = '154';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Girafarig';
        this.fullName = 'Girafarig PAL';
    }
    reduceEffect(store, state, effect) {
        // Psy Bolt
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Girafarig = Girafarig;
