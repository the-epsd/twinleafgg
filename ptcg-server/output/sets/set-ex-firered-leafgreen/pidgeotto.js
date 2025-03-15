"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Clutch',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
            },
            {
                name: 'Cutting Wind',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Pidgeotto';
        this.fullName = 'Pidgeotto RG';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, effect.player.active, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;
