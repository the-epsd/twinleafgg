import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, Player } from '../../../game';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Whitney extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '193';
  public name: string = 'Whitney';
  public fullName: string = 'Whitney LOT';
  public text: string =
    'Draw a card. Then, draw 2 cards for each other Whitney in your discard pile. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const whitneyCount = player.discard.cards.filter((c) => c.name === 'Whitney').length;
      DRAW_CARDS(store, state, player, 1 + 2 * whitneyCount);
    }

    return state;
  }
}
