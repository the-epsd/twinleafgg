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
                name: 'Damage Collection',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Sableye';
        this.fullName = 'Sableye TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            let hasDamagedBench = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0 && target.slot !== game_1.SlotType.ACTIVE) {
                    blocked.push(target);
                }
                if (target.slot === game_1.SlotType.ACTIVE) {
                    blocked.push(target);
                }
                if (cardList.damage > 0 && target.slot === game_1.SlotType.BENCH) {
                    hasDamagedBench = true;
                }
            });
            if (!hasDamagedBench) {
                return state;
            }
            const blockedTo = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList !== opponent.active) {
                    blockedTo.push(target);
                }
            });
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, {
                min: 0,
                allowCancel: false,
                blockedTo: blockedTo,
                singleDestinationTarget: true
            }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (target !== opponent.active) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    if (source == opponent.active) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    if (source.damage > 0) {
                        const damageToMove = Math.min(source.damage);
                        source.damage -= damageToMove;
                        target.damage += damageToMove;
                    }
                }
                return state;
            });
        }
        return state;
    }
}
exports.Sableye = Sableye;
