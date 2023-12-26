import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../..';

export class Schoolboy extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'E';

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '238';

  public name: string = 'Schoolboy';

  public fullName: string = 'Schoolboy FST';

  public text: string =
    'Draw 2 cards. If your opponent has exactly 2, 4, or 6 Prize cards remaining, draw 2 more cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.deck.moveTo(player.hand, 2);

      if (opponent.getPrizeLeft() === 1 || opponent.getPrizeLeft() === 3 || opponent.getPrizeLeft() === 5) {

        player.deck.moveTo(player.hand, 2);

      }

      return state;
    }
    return state;
  }
}
