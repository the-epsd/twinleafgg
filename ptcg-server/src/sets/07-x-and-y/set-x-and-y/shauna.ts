import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Shauna extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public name: string = 'Shauna';
  public fullName: string = 'Shauna XY';
  public text: string = 'Shuffle your hand into your deck. Then, draw 5 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        drawCount: 5,
        sourceCard: this,
      });
    }

    return state;
  }
}
