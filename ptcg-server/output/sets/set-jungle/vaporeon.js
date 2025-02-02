"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Vaporeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Eevee';
        this.attacks = [{
                name: 'Quick Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
            },
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Does 30 damage plus 10 more damage for each {W} Energy attached to Vaporeon but not used to pay for this attack\'s Energy cost. Extra {W} Energy after the 2nd doesn\'t count.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Vaporeon';
        this.fullName = 'Vaporeon JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    effect.damage += 10;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[1]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Count total WATER energy provided
            const totalWaterEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.WATER).length;
            }, 0);
            // Get number of extra WATER energy  
            const extraWaterEnergy = totalWaterEnergy - checkCost.cost.length;
            effect.damage += extraWaterEnergy * 10;
        }
        return state;
    }
}
exports.Vaporeon = Vaporeon;
