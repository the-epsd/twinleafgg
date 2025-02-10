"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BruteBonnet = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BruteBonnet extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ANCIENT];
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Poison Spray',
                cost: [D],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            },
            {
                name: 'Relentless Punches',
                cost: [D, D, D],
                damage: 50,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each damage counter on your opponent\'s Active Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '118';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Brute Bonnet';
        this.fullName = 'Brute Bonnet TWM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 5 * opponent.active.damage);
        }
        return state;
    }
}
exports.BruteBonnet = BruteBonnet;
