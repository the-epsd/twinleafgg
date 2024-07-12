import { GameError, GameMessage, ShuffleDeckPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ResetStamp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'UNM';

  public name: string = 'Reset Stamp';

  public fullName: string = 'Reset Stamp UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '206';

  public text: string =
    'Your opponent shuffles their hand into their deck and draws a card for each of their remaining Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentCards = opponent.hand.cards.filter(c => c !== this);

      if (opponentCards.length === 0 && opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      opponent.hand.moveCardsTo(opponentCards, opponent.deck);

      store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });

      opponent.deck.moveTo(opponent.hand, Math.min(opponent.getPrizeLeft(), opponent.deck.cards.length));
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
