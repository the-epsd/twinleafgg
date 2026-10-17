import { GameError, GameMessage, StateUtils, Player } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { GamePhase, State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import {
  DRAW_CARDS,
  MOVE_CARDS,
  REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CynthiasAmbition extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = "Cynthia's Ambition";
  public fullName: string = "Cynthia's Ambition BRS";
  public text: string =
    "Draw cards until you have 5 cards in your hand. If any of your Pokémon were Knocked Out during your opponent's last turn, draw cards until you have 8 cards in your hand instead.";
  public readonly CYNTHIAS_AMBITION_MARKER = 'CYNTHIAS_AMBITION_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    if (player.deck.cards.length === 0) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const handSize = player.marker.hasMarker(this.CYNTHIAS_AMBITION_MARKER) ? 8 : 5;
      DRAW_CARDS(store, state, player, Math.max(0, handSize - player.hand.cards.length));
      CLEAN_UP_SUPPORTER(store, effect, player);
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

    REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN(effect, this.CYNTHIAS_AMBITION_MARKER, this);

    return state;
  }
}
