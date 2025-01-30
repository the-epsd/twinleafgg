"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kabuto = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Kabuto extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = F;
        this.hp = 30;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [{
                name: 'Kabuto Armor',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Whenever an attack (even your own) does damage to Kabuto (after applying Weakness and Resistance), that attack does half the damage to Kabuto (rounded down to the nearest 10). (Any other effects of attacks still happen.) This power stops working while Kabuto is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Kabuto';
        this.fullName = 'Kabuto FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.specialConditions.includes(game_1.SpecialCondition.PARALYZED)
                || effect.target.specialConditions.includes(game_1.SpecialCondition.ASLEEP)
                || effect.target.specialConditions.includes(game_1.SpecialCondition.CONFUSED)) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(effect.player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEMON_POWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Half the damage and round down to nearest 10
            const halvedDamage = Math.floor(effect.damage / 2);
            effect.damage = Math.floor(halvedDamage / 10) * 10;
            return state;
        }
        return state;
    }
}
exports.Kabuto = Kabuto;
