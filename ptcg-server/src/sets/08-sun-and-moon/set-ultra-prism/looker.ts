import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, TrainerCard, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { GET_CARDS_ON_BOTTOM_OF_DECK, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class Looker extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name: string = 'Looker';
  public fullName: string = 'Looker UPR';
  public text: string =
    'Draw 3 cards from the bottom of your deck. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const bottomCards = GET_CARDS_ON_BOTTOM_OF_DECK(player, 3);
      if (bottomCards.length > 0) {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: bottomCards, sourceCard: this });
      }
    }

    return state;
  }
}
