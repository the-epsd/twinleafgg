"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTurnBoard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
class UTurnBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'H';
        this.set = 'UNM';
        this.name = 'U-Turn Board';
        this.fullName = 'U-Turn Board UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '211';
        this.U_TURN_BOARD_MARKER = 'U_TURN_BOARD_MARKER';
        this.text = 'The Retreat Cost of the Pokémon this card is attached to is [C] less. If this card is discarded from play, put it into your hand instead of the discard pile.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            effect.target.moveCardTo(this, player.hand);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (effect.cost.length === 0) {
                effect.cost = [];
            }
            else {
                effect.cost.splice(0, 1);
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.cards;
            cards.forEach(card => {
                player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
                    return;
                }
                try {
                    const energyEffect = new play_card_effects_1.ToolEffect(player, this);
                    store.reduceEffect(state, energyEffect);
                }
                catch (_a) {
                    return state;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.U_TURN_BOARD_MARKER, this)
                    .map(m => m.source); // Assuming each marker has a 'card' property
                player.discard.moveCardsTo(rescued, player.hand);
                player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
                // Add this line to move the U-Turn Board card to the player's hand
                player.hand.moveCardTo(this, player.hand);
            });
        }
        return state;
    }
}
exports.UTurnBoard = UTurnBoard;
