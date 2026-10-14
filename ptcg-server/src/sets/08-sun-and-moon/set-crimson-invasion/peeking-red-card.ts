import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  CONFIRMATION_PROMPT,
  DRAW_CARDS,
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PeekingRedCard extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Peeking Red Card';
  public fullName: string = 'Peeking Red Card CIN';
  public text: string =
    'Your opponent reveals their hand. You may have your opponent count the cards in their hand, shuffle those cards into their deck, then draw that many cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    if (opponent.hand.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      // Reveal opponent's hand
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards.slice());

      // Ask if player wants to shuffle opponent's hand
      CONFIRMATION_PROMPT(store, state, player, (wantToShuffle) => {
        if (!wantToShuffle) {
          return;
        }

        const cardCount = opponent.hand.cards.length;

        // Shuffle opponent's hand into deck
        MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
          cards: opponent.hand.cards.slice(),
          sourceCard: this,
        });
        SHUFFLE_DECK(store, state, opponent);

        // Opponent draws same number of cards
        DRAW_CARDS(store, state, opponent, cardCount);
      });
    }

    return state;
  }
}
