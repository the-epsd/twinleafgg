"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerperiorV = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SerperiorV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 210;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_V];
        this.attacks = [
            {
                name: 'Noble Light',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 30 damage from each Pokémon (both yours and your opponent\'s).'
            },
            {
                name: 'Solar Beam',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Serperior V';
        this.fullName = 'Serperior V SIT 7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    targets.push(cardList);
                }
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    if (cardList.damage > 0) {
                        targets.push(cardList);
                    }
                });
            });
            if (targets.length === 0) {
                return state;
            }
            targets.forEach(target => {
                // Heal Pokemon
                const healEffect = new game_effects_1.HealEffect(player, target, 30);
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.SerperiorV = SerperiorV;
