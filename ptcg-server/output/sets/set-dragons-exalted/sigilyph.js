"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigilyph = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Sigilyph extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Safeguard',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to ' +
                    'this Pokemon by Pokemon-EX.'
            }];
        this.attacks = [{
                name: 'Psychic',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Does 10 more damage for each Energy attached to ' +
                    'the Defending Pokemon.'
            }];
        this.set = 'DRX';
        this.name = 'Sigilyph';
        this.fullName = 'Sigilyph DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 10;
        }
        // Prevent damage from Pokemon-EX
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // pokemon is evolved
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = state_utils_1.StateUtils.findOwner(state, effect.target);
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
        return state;
    }
}
exports.Sigilyph = Sigilyph;
