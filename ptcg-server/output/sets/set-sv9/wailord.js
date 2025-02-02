"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailord = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Wailord extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wailmer';
        this.cardType = W;
        this.hp = 240;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [C, C, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.set = 'SV9';
        this.name = 'Wailord';
        this.fullName = 'Wailord SV9';
        this.setNumber = '25';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Hydro Pump
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 50;
        }
        return state;
    }
}
exports.Wailord = Wailord;
