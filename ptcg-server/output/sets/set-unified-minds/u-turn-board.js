"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTurnBoard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UTurnBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
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
        // if (effect instanceof TrainerEffect && effect.trainerCard === this) {
        //   const player = effect.player;
        //   player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
        //   console.log('U-Turn Board is active.');
        // }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            if (effect.cost.length === 0) {
                effect.cost = [];
            }
            else {
                effect.cost.splice(0, 1);
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect && state.players.some(p => p.discard.cards.includes(this))) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.U_TURN_BOARD_MARKER && m.source !== undefined)
                    .map(m => m.source);
                player.discard.moveCardsTo(rescued, player.hand);
                player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
            });
        }
        return state;
    }
}
exports.UTurnBoard = UTurnBoard;
// if (effect instanceof ToolEffect && effect.player.active.tool === this) {
//   const player = effect.player;
//   player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
// }
//     if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
//       const player = effect.player;
//       // Do not activate between turns, or when it's not opponents turn.
//       if (state.phase !== GamePhase.ATTACK) {
//         return state;
//       }
//       const target = effect.target;
//       const cards = target.cards;
//       cards.forEach(card => {
//         player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
//       });
//     }
//     if (effect instanceof BetweenTurnsEffect) {
//       state.players.forEach(player => {
//         if (!player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
//           return;
//         }
//         try {
//           const toolEffect = new ToolEffect(player, this);
//           store.reduceEffect(state, toolEffect);
//         } catch {
//           return state;
//         }
//         const rescued: Card[] = player.marker.markers
//           .filter(m => m.name === this.U_TURN_BOARD_MARKER && m.source !== undefined)
//           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//           .map(m => m.source!); // Add non-null assertion operator
//         player.discard.moveCardsTo(rescued, player.hand);
//         player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
//       });
//     }
//     return state;
// }
