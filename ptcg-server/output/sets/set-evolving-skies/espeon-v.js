"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspeonV = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class EspeonV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Zen Shot',
                cost: [game_1.CardType.PSYCHIC],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon V. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Super Psy Bolt',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Espeon V';
        this.fullName = 'Espeon V EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.vPokemon()) {
                    return state;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!blocked.length) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (blocked.length) {
                // Opponent has damaged benched Pokemon
                state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked: blocked }), target => {
                    if (!target || target.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = target[0];
                    store.reduceEffect(state, damageEffect);
                });
            }
            return state;
        }
        return state;
    }
}
exports.EspeonV = EspeonV;
