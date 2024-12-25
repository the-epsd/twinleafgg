"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackKyuremex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BlackKyuremex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 230;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ice Age',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 90,
                text: 'If your opponent\'s Active Pokémon is a [N] Pokémon, it is now Paralyzed.'
            },
            {
                name: 'Black Frost',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 250,
                text: 'This Pokémon also does 30 damage to itself.'
            },];
        this.set = 'SSP';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Black Kyurem ex';
        this.fullName = 'Black Kyurem ex SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.cardType === game_1.CardType.DRAGON) {
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.PARALYZED]);
                store.reduceEffect(state, specialConditionEffect);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.BlackKyuremex = BlackKyuremex;
