"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowbro extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = game_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tumbling Tackle',
                cost: [game_1.CardType.COLORLESS],
                damage: 20,
                text: 'Both Active Pokémon are now Asleep.'
            },
            {
                name: 'Twilight Inspiration',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
            }
        ];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            /*
            const player = effect.player;
            const opponent = StateUtils.getOpponent(state, player);
            const active = opponent.active;
      
            active.addSpecialCondition(SpecialCondition.ASLEEP);
            player.active.addSpecialCondition(SpecialCondition.ASLEEP);
            */
            return prefabs_1.TAKE_X_PRIZES(store, state, effect.player, 5);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() === 1) {
                return prefabs_1.TAKE_X_PRIZES(store, state, player, 2);
            }
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
