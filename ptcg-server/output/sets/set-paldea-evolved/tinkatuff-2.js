"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatuff2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Tinkatuff2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.evolvesFrom = 'Tinkatink';
        this.attacks = [{
                name: 'Play Rough',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            },
            {
                name: 'Pulverizing Press',
                cost: [P, C, C],
                damage: 60,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Tinkatuff';
        this.fullName = 'Tinkatuff2 PAL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
        }
        return state;
    }
}
exports.Tinkatuff2 = Tinkatuff2;
