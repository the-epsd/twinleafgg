"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShayminV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flap',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            },
            {
                name: 'Revenge Blast',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each Prize card your opponent has taken.'
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Shaymin V';
        this.fullName = 'Shaymin V BRS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 40);
        }
        return state;
    }
}
exports.ShayminV = ShayminV;
