import { StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export class CynthiasAmbition extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '138';

  public name: string = 'Cynthia\'s Ambition';

  public fullName: string = 'Cynthia\'s Ambition BRS';

  public readonly CYNTHIAS_AMBITION_MARKER = 'CYNTHIAS_AMBITION_MARKER';

  public text: string =
    'Draw cards until you have 5 cards in your hand. If any of your Pokémon were Knocked Out during your opponent\'s last turn, draw cards until you have 8 cards in your hand instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      if (effect instanceof KnockOutEffect) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);

        const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

        // Do not activate between turns, or when it's not opponents turn.
        if (!duringTurn || state.players[state.activePlayer] !== opponent) {
          return state;
        }

        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);
        if (owner === player) {
          effect.player.marker.addMarker(this.CYNTHIAS_AMBITION_MARKER, this);
        }
        return state;
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      // No Pokemon KO last turn
      if (!player.marker.hasMarker(this.CYNTHIAS_AMBITION_MARKER)) {
        while (player.hand.cards.length < 5) {
          player.deck.moveTo(player.hand, 1);
        }
      } else {
        while (player.hand.cards.length < 8) {
          player.deck.moveTo(player.hand, 1);
        }        
      }

      player.supporterTurn = 1;      
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CYNTHIAS_AMBITION_MARKER);
    }

    return state;
  }
}