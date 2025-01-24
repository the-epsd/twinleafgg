"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aegislash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Aegislash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Doublade';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Mysterious Shield',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex and Pokémon V.'
            }
        ];
        this.attacks = [
            {
                name: 'Hard Bashing',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
        ];
        this.set = 'PAR';
        this.setNumber = '134';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'G';
        this.name = 'Aegislash';
        this.fullName = 'Aegislash PAR';
    }
    reduceEffect(store, state, effect) {
        // Mysterious Shield
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
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex) || sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        // Hard Bashing
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 90);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Aegislash = Aegislash;
