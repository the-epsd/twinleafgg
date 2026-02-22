import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Duraludon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = M;

  public hp: number = 130;

  public weakness = [{ type: R }];

  public resistance = [{ type: G, value: -30 }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [M],
      damage: 30,
      text: ''
    },

    {
      name: 'Raging Hammer',
      cost: [M, M, C],
      damage: 80,
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },

  ];

  public regulationMark = 'H';

  public setNumber = '106';

  public set: string = 'SCR';

  public name: string = 'Duraludon';

  public fullName: string = 'Duraludon SCR';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      effect.damage += player.active.damage;
    }

    return state;
  }

}