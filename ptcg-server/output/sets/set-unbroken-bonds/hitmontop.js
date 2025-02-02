"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmontop = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hitmontop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Hitmontop';
        this.set = 'UNB';
        this.fullName = 'Hitmontop UNB';
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.hp = 90;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Finishing Combo',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'You can use this attack only if your Hitmonlee used Special Combo during your last turn. This attack does 60 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.specialComboTurn = -10;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (state.turn !== this.specialComboTurn + 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 60);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack.name === 'Special Combo' && effect.player.active.getPokemonCard().name === 'Hitmonlee') {
            this.specialComboTurn = state.turn;
        }
        return state;
    }
}
exports.Hitmontop = Hitmontop;
