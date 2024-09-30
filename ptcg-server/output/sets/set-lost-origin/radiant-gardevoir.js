"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantGardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RadiantGardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.RADIANT];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Loving Veil',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'All of your Pokémon take 20 less damage from attacks from your opponent\'s Pokémon V (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Psychic',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Radiant Gardevoir';
        this.fullName = 'Radiant Gardevoir LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 20;
        }
        // Reduce damage by 20
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const sourceCard = effect.source.getPokemonCard();
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Check if the attack is from a Pokémon V, VSTAR, or VMAX
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_V) || sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                // Check if the damage target is owned by this card's owner
                if (targetPlayer === player) {
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
                    effect.damage = Math.max(0, effect.damage - 20);
                }
            }
        }
        return state;
    }
}
exports.RadiantGardevoir = RadiantGardevoir;
