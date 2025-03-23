"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miloticex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Miloticex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Feebas';
        this.cardType = game_1.CardType.WATER;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.powers = [{
                name: 'Sparkling Scales',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage and effects done to this Pokémon by your opponent\'s Tera Pokémon\'s attacks.'
            }];
        this.attacks = [{
                name: 'Hypno Splash',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 160,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Milotic ex';
        this.fullName = 'Milotic ex SSP';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof BetweenTurnsEffect) {
        //   const player = effect.player;
        //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        //     if (cardList.getPokemonCard() === this && cardList.marker.markers.length > 0) {
        //       cardList.clearAttackEffects();
        //       cardList.clearEffects();
        //     }
        //   });
        // }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
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
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_b) {
                    return state;
                }
                effect.damage = 0;
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            state = store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Miloticex = Miloticex;
