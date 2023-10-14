"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronHandsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IronHandsex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Arm Press',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            },
            {
                name: 'Amp You Very Much',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take I more Prize card.'
            },
        ];
        this.set = 'PAR';
        this.name = 'Iron Hands ex';
        this.fullName = 'Iron Hands ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state)) {
                return prefabs_1.TAKE_X_MORE_PRIZE_CARDS(effect, state);
            }
        }
        return state;
    }
}
exports.IronHandsex = IronHandsex;
