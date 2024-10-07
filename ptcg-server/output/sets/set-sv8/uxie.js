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
        this.set = 'SV8';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Uxie';
        this.fullName = 'Uxie SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                putCountersEffect.target = cardList;
                store.reduceEffect(state, putCountersEffect);
            });
        }
        return state;
    }
}
exports.Uxie = Uxie;
