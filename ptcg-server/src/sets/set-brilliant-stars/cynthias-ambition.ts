import { GameError, GameMessage, StateUtils } from '../../game';
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

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // No Pokemon KO last turn
      if (!player.marker.hasMarker(this.CYNTHIAS_AMBITION_MARKER)) {
        const cards = player.hand.cards.filter(c => c !== this);
        const cardsToDraw = Math.max(0, 5 - cards.length);
        player.deck.moveTo(player.hand, cardsToDraw);
      } else {
        const cards = player.hand.cards.filter(c => c !== this);
        const cardsToDraw = Math.max(0, 8 - cards.length);
        player.deck.moveTo(player.hand, cardsToDraw);
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

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

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CYNTHIAS_AMBITION_MARKER);
    }

    return state;
  }
}