"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlappleV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_2 = require("../../game/store/card/card-types");
class FlappleV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sour Spit',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'During your opponent\'s next turn, the Defending Pokémon\'s ' +
                    'attacks cost {C}{C} more.'
            }, {
                name: 'Wing Attack',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Flapple V';
        this.fullName = 'Flapple V BST';
        this.FLAPPLE_V_MARKER = 'FLAPPLE_V_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Sour Spit
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.FLAPPLE_V_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.marker.hasMarker(this.FLAPPLE_V_MARKER, this)) {
            effect.cost.push(card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FLAPPLE_V_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.FLAPPLE_V_MARKER, this);
        }
        return state;
    }
}
exports.FlappleV = FlappleV;
