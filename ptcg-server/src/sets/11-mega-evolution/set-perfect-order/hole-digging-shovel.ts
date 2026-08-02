import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';

export class HoleDiggingShovel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Hole-Digging Shovel';
  public fullName: string = 'Hole-Digging Shovel POR';
  public text: string = 'Discard the top 2 cards of your deck. You may play any number of Item cards during your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      effect.player.deck.moveTo(effect.player.discard, 2);
    }

    return state;
  }
}
