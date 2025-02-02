"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dhelmise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Dhelmise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hook',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Special Anchor',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'If this Pokemon has any Special Energy attached, this attack does 60 more damage.'
            }];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.fullName = 'Dhelmise VIV';
        this.name = 'Dhelmise';
        this.setNumber = '19';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let hasSpecialEnergy = false;
            checkProvidedEnergy.energyMap.forEach(energy => {
                if (energy.card.energyType === card_types_1.EnergyType.SPECIAL) {
                    hasSpecialEnergy = true;
                }
            });
            if (hasSpecialEnergy) {
                console.log('Boosting Damage by 60');
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Dhelmise = Dhelmise;
