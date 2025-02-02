"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinistea = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Sinistea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.attacks = [{
                name: 'Furtive Drop',
                cost: [C],
                damage: 0,
                text: 'Put 2 damage counters on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Sinistea';
        this.fullName = 'Sinistea DAA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const attackEffect = effect;
            const damageEffect = new attack_effects_1.PutCountersEffect(attackEffect, 70);
            return store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Sinistea = Sinistea;
