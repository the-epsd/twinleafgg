"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailord = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
class Wailord extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wailmer';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jumbo Sized',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Special Wave',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'If this Pokemon has any Special Energy attached, this attack does 120 more damage.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Wailord';
        this.fullName = 'Wailord SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
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
            effect.damage = Math.max(0, effect.damage - 30);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            let specialEnergyCount = 0;
            pokemon.cards.forEach(c => {
                if (c instanceof energy_card_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyCount++;
                    }
                }
            });
            if (specialEnergyCount > 0) {
                effect.damage = 120 + 120;
            }
        }
        return state;
    }
}
exports.Wailord = Wailord;
