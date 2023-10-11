"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronHandsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
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
                name: 'Arm Spike',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            },
            {
                name: 'Extreme Amplifier',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take I more Prize card.'
            },
        ];
        this.set = 'PAR';
        this.set2 = 'futureflash';
        this.setNumber = '27';
        this.name = 'Iron Hands ex';
        this.fullName = 'Iron Hands ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1] && effect instanceof game_effects_1.KnockOutEffect) {
            effect.prizeCount += 1;
            return state;
        }
        return state;
    }
}
exports.IronHandsex = IronHandsex;
