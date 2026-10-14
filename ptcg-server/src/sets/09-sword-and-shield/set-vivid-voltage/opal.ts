import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard, StoreLike, State, Player } from '../../../game';
import {
  MULTIPLE_COIN_FLIPS_PROMPT,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Opal extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Opal';
  public fullName: string = 'Opal VIV';
  public text: string =
    'Flip 2 coins. Search your deck for a number of cards up to the number of heads, put them into your hand, and shuffle your deck. You may play only 1 Supporter card during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
        const heads = results.filter((r) => r).length;
        if (heads > 0 && player.deck.cards.length > 0) {
          SEARCH_DECK_FOR_CARDS_TO_HAND(
            store,
            state,
            player,
            this,
            {},
            { min: 0, max: heads, allowCancel: false },
          );
        }
      });
    }

    return state;
  }
}
