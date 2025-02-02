"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 20 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer VIV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalWaterEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.WATER || type === card_types_1.CardType.ANY).length;
            }, 0);
            effect.damage += totalWaterEnergy * 20;
        }
        return state;
    }
}
exports.Wailmer = Wailmer;
