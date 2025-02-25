"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lombre extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Aqua Slash', cost: [W, W], damage: 70, text: 'During your next turn, this Pokémon can\'t attack.' },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Lombre';
        this.fullName = 'Lombre SV9';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        if (effect instanceof game_effects_1.AttackEffect) {
            if (prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this) || prefabs_1.HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Lombre = Lombre;
