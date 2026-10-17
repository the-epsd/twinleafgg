import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, StoreLike, State, GameError, GameMessage, Player } from '../../../game';
import { MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Switch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'G';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '183';
  public name: string = 'Switch';
  public fullName: string = 'Switch SSH';
  public text: string = 'Switch your Active Pokemon with 1 of your Benched Pokemon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasBench = player.bench.some((b) => b.cards.length > 0);
    if (!hasBench) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const hasBench = player.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}
