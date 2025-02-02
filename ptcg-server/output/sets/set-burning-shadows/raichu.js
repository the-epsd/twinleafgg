"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raichu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = L;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Evoshock',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, ' +
                    'you may leave your opponent\'s Active Pokémon Paralyzed.'
            }
        ];
        this.attacks = [
            {
                name: 'Volt Tackle',
                cost: [L, L, C],
                damage: 130,
                text: 'This Pokémon does 30 damage to itself.'
            },
        ];
        this.set = 'BUS';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Raichu';
        this.fullName = 'Raichu BUS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this))
            if (prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result)
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
            }))
                if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
                    prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
        return state;
    }
}
exports.Raichu = Raichu;
