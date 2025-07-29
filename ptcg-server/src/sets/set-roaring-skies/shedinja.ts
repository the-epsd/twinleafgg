import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Shedinja extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nincada';
  public cardType: CardType = G;
  public hp: number = 30;
  public retreat = [C];

  public attacks = [{
    name: 'Cursed Rain',
    cost: [G],
    damage: 0,
    text: 'Put 1 damage counter on each of your opponent\'s Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
  },
  {
    name: 'Hopeless Scream',
    cost: [C],
    damage: 50,
    damageCalculation: 'x',
    text: 'This attack does 50 damage times the number of damage counters on this Pokémon.'
  }];

  public set: string = 'ROS';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shedinja';
  public fullName: string = 'Shedinja ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(1, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = effect.source.damage * 5;
    }

    return state;
  }
}