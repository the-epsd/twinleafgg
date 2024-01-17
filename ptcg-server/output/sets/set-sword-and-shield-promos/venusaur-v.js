"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenusaurV = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class VenusaurV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = game_1.CardType.GRASS;
        this.hp = 220;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leaf Drain',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 50,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Double-Edge',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 190,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.set = 'SWSH';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Venusaur V';
        this.fullName = 'Venusaur V SWSH 100';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const damage = 30;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, damage);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.VenusaurV = VenusaurV;
