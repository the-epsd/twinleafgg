"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palkia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Palkia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Special Crash',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.WATER],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Basic Energy on this Pokémon.'
            }
        ];
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.regulationMark = 'H';
        this.name = 'Palkia';
        this.fullName = 'Palkia SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.card.energyType === card_types_1.EnergyType.BASIC) {
                    energyCount += 1;
                    console.log(energyCount);
                }
            });
            effect.damage = energyCount * 40;
        }
        return state;
    }
}
exports.Palkia = Palkia;
