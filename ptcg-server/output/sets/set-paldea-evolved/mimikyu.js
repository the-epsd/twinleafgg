"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
class Mimikyu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Safeguard',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex and Pokémon V.'
            }];
        this.attacks = [{
                name: 'Ghost Eye',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 7 damage counters on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu PAL';
    }
    reduceEffect(store, state, effect) {
        // Prevent damage from Pokemon-ex
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const opponent = state_utils_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex) || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V) || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const attackEffect = effect;
            const damageEffect = new attack_effects_1.PutCountersEffect(attackEffect, 70);
            return store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
