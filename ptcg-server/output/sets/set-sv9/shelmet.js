"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shelmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Shell Hit',
                cost: [G, C],
                damage: 20,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage done to this Pokémon by attacks. '
            }];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Shelmet';
        this.fullName = 'Shelmet SV9';
        this.CLEAR_SHELL_HIT_MARKER = 'CLEAR_SHELL_HIT_MARKER';
        this.SHELL_HIT_MARKER = 'SHELL_HIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (!result)
                    return;
                prefabs_1.ADD_MARKER(this.SHELL_HIT_MARKER, player.active, this);
                prefabs_1.ADD_MARKER(this.CLEAR_SHELL_HIT_MARKER, opponent, this);
            });
        }
        prefabs_1.PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, this.SHELL_HIT_MARKER, this);
        prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SHELL_HIT_MARKER, this.SHELL_HIT_MARKER, this);
        return state;
    }
}
exports.Shelmet = Shelmet;
