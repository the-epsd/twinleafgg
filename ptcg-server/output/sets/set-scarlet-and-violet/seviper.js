"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seviper = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Seviper extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spit Poison',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.',
            },
            {
                name: 'Venoshock',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 120 more damage.',
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Seviper';
        this.fullName = 'Seviper SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialCondition);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            let damage = 60;
            if (effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                damage += 120;
            }
            effect.damage = damage;
        }
        return state;
    }
}
exports.Seviper = Seviper;
