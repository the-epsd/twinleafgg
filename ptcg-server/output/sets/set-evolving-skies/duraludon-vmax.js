"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuraludonVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DuraludonVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.SINGLE_STRIKE];
        this.evolvesFrom = 'Duraludon V';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 330;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Skyscraper',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokemon by attacks ' +
                    'from your opponent\'s Pokémon that have Special Energy ' +
                    'attached.'
            }];
        this.attacks = [{
                name: 'G-Max Pulverization',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 220,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your ' +
                    'opponent\'s Active Pokémon.'
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Duraludon VMAX';
        this.fullName = 'Duraludon VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 220);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            const opponentPokemon = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponentPokemon);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard &&
                    energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    if (effect instanceof attack_effects_1.PutDamageEffect
                        && opponent.active.cards.includes(energyCard)) {
                        effect.preventDefault = true;
                        return state;
                    }
                }
            });
        }
        return state;
    }
}
exports.DuraludonVMAX = DuraludonVMAX;
