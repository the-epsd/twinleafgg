"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magby = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magby extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 30;
        this.weakness = [{ type: W }];
        this.retreat = [];
        this.attacks = [{
                name: 'Scorching Heater',
                cost: [],
                damage: 0,
                text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack ' +
                    '(even if it is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
            }];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Magby';
        this.fullName = 'Magby PAR';
        this.SCORCHING_HEATER_MARKER = 'SCORCHING_HEATER_MARKER';
        this.CLEAR_SCORCHING_HEATER_MARKER = 'CLEAR_SCORCHING_HEATER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            prefabs_1.ADD_MARKER(this.SCORCHING_HEATER_MARKER, cardList, this);
            prefabs_1.ADD_MARKER(this.CLEAR_SCORCHING_HEATER_MARKER, opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect) && prefabs_1.HAS_MARKER(this.SCORCHING_HEATER_MARKER, effect.target, this)) {
            effect.source.damage += 30;
        }
        prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_SCORCHING_HEATER_MARKER, this.SCORCHING_HEATER_MARKER, this);
        return state;
    }
}
exports.Magby = Magby;
