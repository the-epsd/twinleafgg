import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Darumaka2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Singe',
      cost: [R],
      damage: 0,
      text: 'The Defending Pokemon is now Burned.'
    },
    {
      name: 'Rollout',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Darumaka';
  public fullName: string = 'Darumaka BLW 24';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }
    return state;
  }
}
