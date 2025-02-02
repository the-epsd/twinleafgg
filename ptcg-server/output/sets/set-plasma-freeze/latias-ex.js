"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatiasEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class LatiasEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = N;
        this.hp = 180;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Bright Down',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Pokémon with Abilities.'
            }];
        this.attacks = [
            {
                name: 'Barrier Break',
                cost: [R, P, C],
                damage: 70,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on the Defending Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.name = 'Latias EX';
        this.fullName = 'Latias EX PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined)
                return state;
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent || state.phase !== state_1.GamePhase.ATTACK)
                return state;
            if (sourceCard.powers.length > 0
                && !prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, sourceCard)
                && !prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                effect.preventDefault = true;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.damage > 0) {
                opponent.active.damage += effect.damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, effect.damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.LatiasEX = LatiasEX;
