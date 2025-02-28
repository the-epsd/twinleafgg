"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Phanpy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Endure',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, if this Pokémon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out, and its remaining HP becomes 10.'
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy CES';
        this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (!result)
                    return;
                prefabs_1.ADD_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.player.active, this);
                prefabs_1.ADD_MARKER(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
            });
            return state;
        }
        //Endure UP
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect instanceof attack_effects_1.PutDamageEffect
            && prefabs_1.HAS_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.target, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= (checkHpEffect.hp - player.active.damage)) {
                effect.preventDefault = true;
                effect.target.damage = checkHpEffect.hp - 10;
            }
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            //Remove the marker from Phanpy at the end of the opponent's turn.
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                prefabs_1.REMOVE_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, cardList, this);
            });
        }
        return state;
    }
}
exports.Phanpy = Phanpy;
