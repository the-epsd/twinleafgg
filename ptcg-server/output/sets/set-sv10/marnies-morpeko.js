"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesMorpeko = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MarniesMorpeko extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spike Wheel',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each [D] Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'SVOM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Marnie\'s Morpeko';
        this.fullName = 'Marnie\'s Morpeko SVOM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === game_1.CardType.DARK || cardType === game_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 40;
        }
        return state;
    }
}
exports.MarniesMorpeko = MarniesMorpeko;
