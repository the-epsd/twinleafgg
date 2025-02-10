"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steelix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = F;
        this.hp = 190;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Powerful Rage',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Earthquake',
                cost: [F, F, C],
                damage: 180,
                text: 'This attack also does 30 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.regulationMark = 'E';
        this.set = 'FST';
        this.setNumber = '139';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steelix';
        this.fullName = 'Steelix FST';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            //The attack needs to be reset; otherwise, it will always cause 20 damage.
            effect.damage = 0;
            prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 2 * effect.player.active.damage);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            //I couldn't find a prefab to add damage to my Pokémon on the bench.
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList !== player.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Steelix = Steelix;
