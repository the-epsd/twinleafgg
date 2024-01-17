"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Entangling Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to each other Pokémon in play with any damage counters on it. (Both yours and your opponent\'s. Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'SV5K';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Raichu';
        this.fullName = 'Raichu SV5K';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            const oppHasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched && !oppHasBenched) {
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
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    return state;
                }
                else {
                    blocked.push(target);
                }
                if (!blocked.length) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
                }
                if (blocked.length) {
                    // Opponent has damaged benched Pokemon
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;
