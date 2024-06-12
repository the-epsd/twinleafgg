import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class BraveyCharm extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '173';

  public name: string = 'Bravery Charm';

  public fullName: string = 'Bravery Charm PAL';

  public text: string =
    'The Basic Pokémon this card is attached to gets +50 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const card = effect.target.getPokemonCard();


      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (card === undefined) {
        return state;
      }
  
      if (card.stage === Stage.BASIC) {
        effect.hp += 50;
      }
    }
    return state;
  }

}
