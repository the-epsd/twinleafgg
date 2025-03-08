"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electivireex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Electivireex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electabuzz';
        this.cardType = L;
        this.hp = 280;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Dual Bolt',
                cost: [L, C],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'High Voltage Press',
                cost: [L, L, C],
                damage: 180,
                damageCalculation: '+',
                text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 100 more damage.'
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Electivire ex';
        this.fullName = 'Electivire ex SV9a';
    }
    reduceEffect(store, state, effect) {
        // Dual Bolt
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state, 2, 2);
        }
        // High Voltage Press
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const extraEffectCost = [L, L, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.Electivireex = Electivireex;
