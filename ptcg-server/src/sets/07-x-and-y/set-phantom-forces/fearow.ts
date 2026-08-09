import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_COIN_FOR_FLY } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spearow';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fly',
      cost: [C, C],
      damage: 40,
      text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Drill Peck',
      cost: [C, C, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'PHF';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fearow';
  public fullName: string = 'Fearow PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_FOR_FLY(store, state, effect, this);
    }
    return state;
  }
}
