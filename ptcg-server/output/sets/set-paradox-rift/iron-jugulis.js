"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronJugulis = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const future_booster_energy_capsule_1 = require("./future-booster-energy-capsule");
class IronJugulis extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [game_1.CardTag.FUTURE];
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Homing Headbutt',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to 3 of your opponent\'s Pokémon that have any damage counters on them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Baryon Beam',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 150,
                text: 'If this Pokémon has a Future Booster Energy Capsule attached, this attack can be used for [C][C][C].'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Iron Jugulis';
        this.fullName = 'Iron Jugulis PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
                state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 3, allowCancel: false, blocked: blocked }), target => {
                    if (!target || target.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.target = target[0];
                    store.reduceEffect(state, damageEffect);
                });
            }
            if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (cardList === effect.target) {
                        return;
                    }
                    if (card === this && cardList.tool instanceof future_booster_energy_capsule_1.FutureBoosterEnergyCapsule) {
                        const baryonBeam = 2;
                        const attackCost = this.attacks[1].cost;
                        const colorlessToRemove = baryonBeam;
                        this.attacks[1].cost = attackCost.filter(c => c !== game_1.CardType.COLORLESS).slice(0, -colorlessToRemove);
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.IronJugulis = IronJugulis;
