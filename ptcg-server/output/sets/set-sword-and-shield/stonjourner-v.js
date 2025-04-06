"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StonjournerV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class StonjournerV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = F;
        this.hp = 220;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Guard Press',
                cost: [F],
                damage: 40,
                text: 'During your opponent\'s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Mega Kick',
                cost: [F, F, F],
                damage: 150,
                text: ''
            },
        ];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Stonjourner V';
        this.fullName = 'Stonjourner V SSH';
        this.GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';
        this.CLEAR_GUARD_PRESS_MARKER = 'CLEAR_GUARD_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_2.ADD_MARKER(this.GUARD_PRESS_MARKER, player.active, this);
            prefabs_2.ADD_MARKER(this.CLEAR_GUARD_PRESS_MARKER, opponent, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (prefabs_2.HAS_MARKER(this.GUARD_PRESS_MARKER, effect.target, this)) {
                effect.damage -= 20;
            }
        }
        prefabs_2.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_GUARD_PRESS_MARKER, this.GUARD_PRESS_MARKER, this);
        return state;
    }
}
exports.StonjournerV = StonjournerV;
