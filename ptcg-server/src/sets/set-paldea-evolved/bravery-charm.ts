import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PokemonCard } from '../../game';

export class BraveyCharm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public set: string = 'PAL';

  public set2: string = 'paldeaevolved';

  public setNumber: string = '173';

  public name: string = 'Bravery Charm';

  public fullName: string = 'Bravery Charm PAL';

  public text: string =
    'The Basic Pokémon this card is attached to gets +50 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (this instanceof PokemonCard && this.stage === Stage.BASIC) {

      if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {

        effect.hp += 50;
      }


      return state;
    }
    return state;
  }
}