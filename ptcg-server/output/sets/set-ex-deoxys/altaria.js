"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Altaria = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Altaria extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Swablu';
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Safeguard',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Prevent all effects of attacks, including damage, done to Altaria by your opponent\'s Pokémon-ex.'
            }
        ];
        this.attacks = [
            {
                name: 'Double Wing Attack',
                cost: [game_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Does 20 damage to each Defending Pokémon.'
            },
            {
                name: 'Dive',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'EX Deoxys';
        this.setNumber = '1';
        this.name = 'Altaria';
        this.fullName = 'Altaria';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Handle 'Double Wing Attack' effect
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                store.reduceEffect(state, damageEffect);
            });
        }
        // Prevent damage from Pokemon-EX
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // pokemon is evolved
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard && sourceCard.tags.includes(game_1.CardTag.POKEMON_ex)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Altaria = Altaria;
