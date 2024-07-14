"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafeonVMAX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LeafeonVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VMAX;
        this.evolvesFrom = 'Leafeon V';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 310;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_VMAX];
        this.attacks = [
            {
                name: 'Grass Knot',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 60 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            },
            {
                name: 'Max Leaf',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 170,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Leafeon VMAX';
        this.fullName = 'Leafeon VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveCard = opponent.active.getPokemonCard();
            if (opponentActiveCard) {
                const retreatCost = opponentActiveCard.retreat.filter(c => c === game_1.CardType.COLORLESS).length;
                effect.damage = retreatCost * 60;
                return state;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
            return state;
        }
        return state;
    }
}
exports.LeafeonVMAX = LeafeonVMAX;
