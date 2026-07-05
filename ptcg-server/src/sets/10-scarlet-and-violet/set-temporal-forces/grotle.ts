import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Grotle extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Turtwig';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Cut',
      cost: [CardType.GRASS],
      damage: 20,
      text: ''
    },
    {
      name: 'Ramming Shell',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'During your opponent\'s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';

  public name: string = 'Grotle';

  public fullName: string = 'Grotle TEF';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }
}
