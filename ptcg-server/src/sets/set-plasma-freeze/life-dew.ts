import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardTag, TrainerCard, TrainerType } from '../../game';
import { KnockOutEffect } from '../../game/store/effects/game-effects';

export class LifeDew extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;
  public tags = [CardTag.ACE_SPEC];
  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name = 'Life Dew';
  public fullName = 'Life Dew PLF';

  public text: string = 'If the Pokémon this card is attached to is Knocked Out, your opponent takes 1 fewer Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount -= 1;
    }

    return state;
  }
}
