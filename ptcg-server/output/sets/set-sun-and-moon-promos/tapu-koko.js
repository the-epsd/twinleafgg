"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKoko = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TapuKoko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.retreat = [];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.attacks = [
            {
                name: 'Flying Flip',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'SMP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'SM30';
        this.name = 'Tapu Koko';
        this.fullName = 'Tapu Koko SMP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            effect.damage = 20;
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        return state;
    }
}
exports.TapuKoko = TapuKoko;
