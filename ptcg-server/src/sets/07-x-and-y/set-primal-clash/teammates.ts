import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { GamePhase } from '../../../game/store/state/state';
import {
  MOVE_CARDS,
  REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Teammates extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Teammates';
  public fullName: string = 'Teammates PRC';
  public text: string = `You can play this card only if 1 of your Pokémon was Knocked Out during your opponent's last turn.

Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.`;

  public readonly TEAMMATES_MARKER = 'TEAMMATES_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (!player.marker.hasMarker(this.TEAMMATES_MARKER)) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // No Pokemon KO last turn
      if (!player.marker.hasMarker(this.TEAMMATES_MARKER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [this], sourceCard: this });

      // We will discard this card after prompt confirmation
      // This will prevent unblocked supporter to appear in the discard pile
      effect.preventDefault = true;

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 1, max: Math.min(2, player.deck.cards.length), allowCancel: false },
      );

      return state;
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
        effect.player.marker.addMarker(this.TEAMMATES_MARKER, this);
      }
      return state;
    }

    REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN(effect, this.TEAMMATES_MARKER, this);

    return state;
  }
}
