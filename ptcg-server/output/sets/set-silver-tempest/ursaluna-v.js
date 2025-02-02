"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrsalunaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class UrsalunaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hard Coat',
                powerType: __1.PowerType.ABILITY,
                text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Peat Shoulder',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 220,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
            }];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Ursaluna V';
        this.fullName = 'Ursaluna V SIT';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== __1.GamePhase.ATTACK) {
                return state;
            }
            const player = __1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: __1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage -= effect.player.active.damage;
            return state;
        }
        return state;
    }
}
exports.UrsalunaV = UrsalunaV;
