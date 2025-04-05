"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicham = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Medicham extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meditite';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Barrage',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                barrage: true,
                text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Calm Mind',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            }, {
                name: 'Yoga Kick',
                cost: [F, F],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'PRC';
        this.name = 'Medicham';
        this.fullName = 'Medicham PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Medicham = Medicham;
