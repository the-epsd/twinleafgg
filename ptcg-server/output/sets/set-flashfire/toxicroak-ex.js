"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToxicroakEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ToxicroakEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Triple Poison',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Poisoned. Put 3 damage ' +
                    'counters instead of 1 on that Pokemon between turns.'
            }, {
                name: 'Smash Uppercut',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
        ];
        this.set = 'FLF';
        this.name = 'Toxicroak EX';
        this.fullName = 'Toxicroak EX FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 30;
            return store.reduceEffect(state, specialCondition);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.ToxicroakEx = ToxicroakEx;
