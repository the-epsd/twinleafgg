"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toedscruelex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Toedscruelex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toedscool';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Protective Mycelium',
                powerType: game_1.PowerType.ABILITY,
                text: ' Prevent all effects of attacks used by your opponent\'s Pokémon done to all of your Pokémon that have Energy attached. (Existing effects are not removed. Damage is not an effect.) '
            }];
        this.attacks = [{
                name: 'Colony Rush',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 80,
                damageCalculation: '+',
                text: ' This attack does 40 more damage for each of your Benched Pokémon that has any [G] Energy attached. '
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Toedscruel ex';
        this.fullName = 'Toedscruel ex OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const sourceCard = effect.source.getPokemonCard();
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isToedscruelInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isToedscruelInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isToedscruelInPlay = true;
                }
            });
            if (!isToedscruelInPlay) {
                return state;
            }
            if (sourceCard && effect.target.cards.some(c => c instanceof game_1.EnergyCard)) {
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
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokesWithGrass = 0;
            player.bench.forEach((cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                let hasGrass = false;
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    if (energy.provides.some(type => type === card_types_1.CardType.GRASS)) {
                        hasGrass = true;
                    }
                });
                if (hasGrass) {
                    pokesWithGrass++;
                }
            });
            effect.damage += pokesWithGrass * 40;
            return state;
        }
        return state;
    }
}
exports.Toedscruelex = Toedscruelex;
