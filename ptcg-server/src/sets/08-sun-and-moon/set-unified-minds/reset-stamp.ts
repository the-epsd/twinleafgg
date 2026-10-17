import { GameError, GameMessage, Player } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ResetStamp extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '206';
  public name: string = 'Reset Stamp';
  public fullName: string = 'Reset Stamp UNM';
  public text: string =
    'Your opponent shuffles their hand into their deck and draws a card for each of their remaining Prize cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    if (opponent.hand.cards.length === 0 && opponent.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentCards = opponent.hand.cards.filter((c) => c !== this);

      if (opponentCards.length === 0 && opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
        cards: opponentCards,
        sourceCard: this,
      });

      SHUFFLE_DECK(store, state, opponent);

      MOVE_CARDS(store, state, opponent.deck, opponent.hand, {
        count: Math.min(opponent.getPrizeLeft(), opponent.deck.cards.length),
        sourceCard: this,
      });
    }

    return state;
  }
}
