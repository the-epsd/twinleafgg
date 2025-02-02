"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Terrakion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{
                type: card_types_1.CardType.GRASS
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Retaliate',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If any of your Pokemon were Knocked Out by damage from an opponent\'s ' +
                    'attack during his or her last turn, this attack does 60 more damage.'
            }, {
                name: 'Land Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.RETALIATE_MARKER = 'RETALIATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
                effect.damage += 60;
            }
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.RETALIATE_MARKER);
        }
        return state;
    }
}
exports.Terrakion = Terrakion;
