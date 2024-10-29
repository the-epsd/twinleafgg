"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togetic = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Togetic extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Togepi';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Drain Kiss',
                cost: [C, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Togetic';
        this.fullName = 'Togetic SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const target = player.active;
            const healEffect = new game_effects_1.HealEffect(player, target, 30);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Togetic = Togetic;
