"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greninja = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Greninja extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Aqua Shower',
                cost: [W],
                damage: 20,
                text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            },
            {
                name: 'Dual Cut',
                cost: [W, C],
                damage: 60,
                text: 'Flip 2 coins. This attack does 60 damage times the number of heads.',
            }
        ];
        this.set = 'XYP';
        this.setNumber = '162';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Greninja';
        this.fullName = 'Greninja XYP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === opponent.active) {
                    return state;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = cardList;
                state = store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result2 => {
                    const headsCount = (result ? 1 : 0) + (result2 ? 1 : 0);
                    effect.damage = headsCount * 60;
                });
            });
        }
        return state;
    }
}
exports.Greninja = Greninja;
