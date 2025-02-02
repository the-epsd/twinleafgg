"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwag = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Poliwag extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Poliwag';
        this.set = 'BS';
        this.fullName = 'Poliwag BS';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each {W} Energy attached to Poliwag but not used to pay for this attack’s Energy cost. Extra {W} Energy after the 2nd don’t count.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Filter for Water energies
            const waterEnergies = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER));
            // Add damage for extra Water energies up to 2
            const extraEnergies = Math.min(waterEnergies.length - checkCost.cost.length, 2);
            effect.damage += extraEnergies * 10;
        }
        return state;
    }
}
exports.Poliwag = Poliwag;
