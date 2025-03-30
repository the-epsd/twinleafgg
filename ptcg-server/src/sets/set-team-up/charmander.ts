import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 50;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [R],
      damage: 10,
      text: ''
    },
    {
      name: 'Reprisal',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each damage counter on this Pokémon.'
    },

  ];

  public set: string = 'TEU';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = effect.player.active.damage * 2;
      return state;
    }
    return state;
  }

}