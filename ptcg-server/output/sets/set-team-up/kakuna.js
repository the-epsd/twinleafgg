"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakunaTEU = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class KakunaTEU extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Weedle';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.set = 'TEU';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kakuna';
        this.fullName = 'Kakuna TEU';
        this.powers = [
            {
                name: 'Grass Cushion',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon has any G Energy attached to it, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }
        ];
        this.attacks = [{ name: 'Bug Bite', cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], damage: 20, text: '' }];
    }
    reduceEffect(store, state, effect) {
        // Grass Cushion
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const target = effect.target;
            // It's not an attack, or not targeting this Pokemon
            if (target.getPokemonCard() !== this || state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            // Check if we're holding a Grass energy
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, target);
            store.reduceEffect(state, checkProvidedEnergy);
            const enoughEnergies = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, [game_1.CardType.GRASS]);
            if (!enoughEnergies) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Now do the damage reduction
            effect.damage -= 60;
        }
        return state;
    }
}
exports.KakunaTEU = KakunaTEU;
