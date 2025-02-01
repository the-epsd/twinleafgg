"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fearow = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fearow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spearow';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Beak Catch',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.',
            },
            { name: 'Speed Dive', cost: [C], damage: 50, text: '' }
        ];
        this.set = 'MEW';
        this.name = 'Fearow';
        this.fullName = 'Fearow MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, 0, 3);
        return state;
    }
}
exports.Fearow = Fearow;
