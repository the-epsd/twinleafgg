"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenusaurVMAX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class VenusaurVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VMAX;
        this.tags = [game_1.CardTag.POKEMON_VMAX];
        this.cardType = game_1.CardType.GRASS;
        this.evolvesFrom = 'Venusaur V';
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.hp = 330;
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Forest Storm',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage for each [G] Energy attached to all of your Pokémon.'
            },
            {
                name: 'G-Max Bloom',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 210,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'SWSH';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Venusaur VMAX';
        this.fullName = 'Venusaur VMAX SWSH 102';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                let grassEnergy = 0;
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energy.provides.forEach(c => {
                        grassEnergy += c === game_1.CardType.GRASS ? 1 : 0;
                    });
                });
                effect.damage += 30 * grassEnergy;
                return state;
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
                healTargetEffect.target = player.active;
                state = store.reduceEffect(state, healTargetEffect);
            }
            return state;
        }
        return state;
    }
}
exports.VenusaurVMAX = VenusaurVMAX;
