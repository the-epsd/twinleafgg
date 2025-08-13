import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Cheren extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'EPO';

  public name: string = 'Cheren';

  public fullName: string = 'Cheren EPO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public text: string =
    'Draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      DRAW_CARDS(player, 3);
    }

    return state;
  }

}
