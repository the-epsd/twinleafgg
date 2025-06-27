import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class TrashExchange extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'G1';
  public setNumber: string = '126';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Trash Exchange';
  public fullName: string = 'Trash Exchange G1';

  public text: string = 'Count the number of cards in your discard pile and shuffle them into your deck. Then discard that many cards from the top of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const discardCount = player.discard.cards.length;
      MOVE_CARDS(store, state, player.discard, player.deck);
      SHUFFLE_DECK(store, state, player);
      player.deck.moveTo(player.discard, discardCount);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }

}
