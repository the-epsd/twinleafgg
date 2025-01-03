import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BodybuildingDumbbells extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Bodybuilding Dumbbells';

  public fullName: string = 'Bodybuilding Dumbbells BUS';

  public text: string = 'The Stage 1 Pokémon this card is attached to gets +40 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.target.getPokemonCard();

      if (sourceCard?.stage !== Stage.STAGE_1) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.hp += 40;
      
      return state;
    }
    return state;
  }

}
