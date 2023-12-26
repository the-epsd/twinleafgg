"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleffa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Cleffa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Grasping Draw',
                cost: [],
                damage: 0,
                text: 'Draw cards until you have 7 cards in your hand.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Cleffa';
        this.fullName = 'Cleffa OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(7, effect, state);
        }
        return state;
    }
}
exports.Cleffa = Cleffa;
