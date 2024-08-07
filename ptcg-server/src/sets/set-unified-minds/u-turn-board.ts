import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachPokemonToolEffect, ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class UTurnBoard extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'UNM';

  public name: string = 'U-Turn Board';

  public fullName: string = 'U-Turn Board UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '211';

  public readonly U_TURN_BOARD_MARKER = 'U_TURN_BOARD_MARKER';

  public text: string =
    'The Retreat Cost of the Pokémon this card is attached to is [C] less. If this card is discarded from play, put it into your hand instead of the discard pile.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      effect.target.moveCardTo(this, player.hand);
    }

    // if (effect instanceof TrainerEffect && effect.trainerCard === this) {
    //   const player = effect.player;
    //   player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
    //   console.log('U-Turn Board is active.');
    // }

    if (effect instanceof AttachPokemonToolEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
      console.log('U-Turn Board is on a card.');
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.tool === this) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.cost.length === 0) {
        effect.cost = [];
      } else {
        effect.cost.splice(0, 1);
      }
    }

    state.players.forEach(player => {
      // Check if the card is in the player's discard pile
      const uTurnBoardInDiscard = player.discard.cards.some(card => card === this);
      if (uTurnBoardInDiscard && player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
        // Move the card from the discard pile to the player's hand
        player.discard.moveCardTo(this, player.hand);
        player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
      }
    });
    return state;
  }
}

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
//           const energyEffect = new ToolEffect(player, this);
//           store.reduceEffect(state, energyEffect);
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