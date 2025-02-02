"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finizen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Finizen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Aqua Slash',
                cost: [W],
                damage: 30,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'TWM';
        this.setNumber = '59';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Finizen';
        this.fullName = 'Finizen TWM';
        // for preventing the pokemon from attacking on the next turn
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect)
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        return state;
    }
}
exports.Finizen = Finizen;
