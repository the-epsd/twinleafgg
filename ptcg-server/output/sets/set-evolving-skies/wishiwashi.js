"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishiwashi = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Wishiwashi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.RAPID_STRIKE];
        this.cardType = game_1.CardType.WATER;
        this.hp = 30;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Group Power',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has 3 or more [W] Energy attached, it gets +150 HP.'
            }
        ];
        this.attacks = [
            {
                name: 'Schooling Shot',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 more damage for each basic Energy attached to this Pokémon.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Wishiwashi';
        this.fullName = 'Wishiwashi EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === game_1.CardType.WATER || cardType === game_1.CardType.ANY;
                }).length;
                if (energyCount >= 3) {
                    this.hp += 150;
                }
                return state;
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                let energyCount = 0;
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    if (em.card.energyType === game_1.EnergyType.BASIC) {
                        energyCount += em.provides.length;
                    }
                });
                effect.damage += energyCount * 30;
            }
            return state;
        }
        return state;
    }
}
exports.Wishiwashi = Wishiwashi;
