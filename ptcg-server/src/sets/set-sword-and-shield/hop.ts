import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { GameError, GameMessage } from '../../game';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Hop extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SSH';
  public name: string = 'Hop';
  public fullName: string = 'Hop SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '165';

  public text: string =
    'Draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      DRAW_CARDS(player, 3);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
