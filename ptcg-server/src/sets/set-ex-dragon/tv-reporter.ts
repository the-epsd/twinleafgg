import { GameError, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_CARDS_FROM_YOUR_HAND } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TvReporter extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'TV Reporter';
  public fullName: string = 'TV Reporter DR';

  public text: string =
    'Draw 3 cards. Then discard any 1 card from your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      DRAW_CARDS(player, 3);
      DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 1);

      CLEAN_UP_SUPPORTER(effect, player);
    }

    return state;
  }
}
