import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

//Avery is not done yet!! have to add the "remove from bench" logic

export class Avery extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public set2: string = 'chillingreign';

  public setNumber: string = '130';

  public regulationMark = 'E';

  public name: string = 'Avery';

  public fullName: string = 'Avery CRE';

  public text: string =
    'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Draw 3 cards
      player.deck.moveTo(player.hand, 3);

      // Get opponent

      // Opponent discards cards if more than 3 bench Pokemon

      // Prompt to choose bench

      // Remove last Pokemon from bench
  
      // Prompt opponent to discard Pokemon

    }

    return state;
  }
}
