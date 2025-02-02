"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Lapras extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each {W} Energy attached to Lapras but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
            },
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            },
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Lapras';
        this.fullName = 'Lapras FO';
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
            // Filter for only Water Energy
            const waterEnergy = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER));
            // Get number of extra Water energy  
            const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;
            // Apply damage boost based on extra Water energy
            if (extraWaterEnergy == 1)
                effect.damage += 10;
            if (extraWaterEnergy == 2)
                effect.damage += 20;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    store.reduceEffect(state, addSpecialCondition);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Lapras = Lapras;
