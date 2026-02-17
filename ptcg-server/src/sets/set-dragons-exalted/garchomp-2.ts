import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Garchomp2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gabite';
  public cardType: CardType = N;
  public hp: number = 140;
  public weakness = [{ type: N }];
  public retreat = [];

  public attacks = [
    {
      name: 'Jet Headbutt',
      cost: [C],
      damage: 40,
      text: ''
    },
    {
      name: 'Sand Tomb',
      cost: [W, F, C],
      damage: 80,
      text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '91';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Garchomp';
  public fullName: string = 'Garchomp DRX 91';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Sand Tomb - Defending Pokemon can't retreat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
