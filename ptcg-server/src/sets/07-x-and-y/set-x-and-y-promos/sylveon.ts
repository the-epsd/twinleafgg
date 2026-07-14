import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Sylveon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = Y;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disarming Voice',
    cost: [Y],
    damage: 20,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Fairy Wind',
    cost: [Y, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'XYP';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sylveon';
  public fullName: string = 'Sylveon XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disarming Voice
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
