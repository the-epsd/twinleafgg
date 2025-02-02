"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absol = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Absol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 100;
        this.attacks = [
            {
                name: 'Swirling Diaster',
                cost: [D],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Claw Rend',
                cost: [D, C],
                damage: 50,
                text: 'If your opponent’s Active Pokémon already has any damage counters on it, this attack does 70 more damage.'
            }
        ];
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Absol';
        this.fullName = 'Absol ASR';
    }
    reduceEffect(store, state, effect) {
        // Swirling Diaster
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 10);
            activeDamageEffect.target = opponent.active;
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        //Claw Rend
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 70;
            }
            return state;
        }
        return state;
    }
}
exports.Absol = Absol;
