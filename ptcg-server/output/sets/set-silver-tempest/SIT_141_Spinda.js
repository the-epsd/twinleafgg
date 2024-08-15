"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinda = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Spinda extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Dizzying Spin',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokémon.Your opponent\'s Active Pokémon is now Confused. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Spinda';
        this.fullName = 'Spinda SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 10);
            store.reduceEffect(state, activeDamageEffect);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Spinda = Spinda;
