"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uxie = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Uxie extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Painful Memories',
                cost: [P],
                damage: 0,
                text: 'Put 2 damage counters on each of your opponent\'s Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '78';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Uxie';
        this.fullName = 'Uxie SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const activeDamageEffect = new attack_effects_1.PutCountersEffect(effect, 20);
            activeDamageEffect.target = opponent.active;
            store.reduceEffect(state, activeDamageEffect);
            opponent.bench.forEach((bench, index) => {
                if (bench.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                    damageEffect.target = bench;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Uxie = Uxie;
