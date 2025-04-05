"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diglett = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Diglett extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mud Slap',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Sand Pit',
                cost: [F, C],
                damage: 20,
                text: "The Defending Pokémon can't retreat during your opponent's next turn."
            },
        ];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Diglett';
        this.fullName = 'Diglett CG';
        this.SAND_PIT_MARKER = 'SAND_PIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_2.ADD_MARKER(this.SAND_PIT_MARKER, opponent.active, this);
        }
        prefabs_2.BLOCK_RETREAT_IF_MARKER(effect, this.SAND_PIT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.SAND_PIT_MARKER, this);
        return state;
    }
}
exports.Diglett = Diglett;
