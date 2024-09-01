"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegigigasV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RegigigasV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 240;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hammer In',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Angry Whack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculator: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon. This Pokémon is now Confused.'
            },
        ];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Regigigas V';
        this.fullName = 'Regigigas V CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += effect.player.active.damage;
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            specialConditionEffect.target = effect.player.active;
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.RegigigasV = RegigigasV;
