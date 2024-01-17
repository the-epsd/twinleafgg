"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianArcanine = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HisuianArcanine extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.cardType = game_1.CardType.FIGHTING;
        this.hp = 150;
        this.evolvesFrom = 'Hisuian Growlithe';
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Boulder Crush',
                cost: [game_1.CardType.FIGHTING, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Scorching Horn',
                cost: [game_1.CardType.FIGHTING, game_1.CardType.FIGHTING, game_1.CardType.COLORLESS],
                damage: 80,
                text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage, and your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Hisuian Arcanine';
        this.fullName = 'Hisuian Arcanine ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === game_1.CardType.FIRE;
                }).length;
            });
            if (energyCount > 0) {
                effect.damage = effect.damage + 80;
                effect.target.specialConditions.push(game_1.SpecialCondition.BURNED);
            }
            return state;
        }
        return state;
    }
}
exports.HisuianArcanine = HisuianArcanine;
