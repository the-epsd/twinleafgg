import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  MULTIPLE_COIN_FLIPS_PROMPT,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class OldPc extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '164';
  public name: string = 'Old PC';
  public fullName: string = 'Old PC DAA';
  public text: string =
    'Flip 2 coins. If both are heads, put a card from your discard pile into your hand. You may play any number of Item cards during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      effect.preventDefault = true;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        if (results.every((result) => result)) {
          SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
            store,
            state,
            player,
            this,
            {},
            { min: 1, max: 1, allowCancel: false },
          );
        }
      });
    }

    return state;
  }
}
