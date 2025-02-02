"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marshtomp = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Marshtomp extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.cardType = game_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Muddy Water',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Surf',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            },
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Marshtomp';
        this.fullName = 'Marshtomp CES';
        this.evolvesFrom = 'Mudkip';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        return state;
    }
}
exports.Marshtomp = Marshtomp;
