"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electivire = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Electivire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electabuzz';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Thunder Shock',
                cost: [L, C],
                damage: 50,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Electrified Bolt',
                cost: [L, L, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If this Pokémon has any Special Energy attached, this attack does 90 more damage.'
            }
        ];
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Electivire';
        this.fullName = 'Electivire RCL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let hasSpecialEnergy = false;
            checkProvidedEnergyEffect.energyMap.forEach(energy => {
                if (energy.card.energyType === card_types_1.EnergyType.SPECIAL) {
                    hasSpecialEnergy = true;
                }
            });
            if (hasSpecialEnergy) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Electivire = Electivire;
