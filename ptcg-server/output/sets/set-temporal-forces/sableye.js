"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sableye extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = game_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [game_1.CardType.DARK],
                damage: 20,
                text: ''
            },
            {
                name: 'Damage Collector',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Sableye';
        this.fullName = 'Sableye PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
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
                const maxAllowedDamage = [];
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                    store.reduceEffect(state, checkHpEffect);
                    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
                });
                return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 0, allowCancel: false }), transfers => {
                    if (transfers === null) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        if (source.damage >= 0) {
                            source.damage -= source.damage;
                            target.damage += source.damage;
                        }
                    }
                    return state;
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Sableye = Sableye;
