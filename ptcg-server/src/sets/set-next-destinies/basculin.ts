import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Basculin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Bared Fangs',
      cost: [W, C],
      damage: 60,
      text: 'If the Defending Pokemon has no damage counters on it, this attack does nothing.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Basculin';
  public fullName: string = 'Basculin NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bared Fangs - only works if defender has damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if defending Pokemon has damage
      if (opponent.active.damage === 0) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
