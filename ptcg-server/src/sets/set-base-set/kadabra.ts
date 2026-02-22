import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kadabra extends PokemonCard {

  public name = 'Kadabra';

  public set = 'BS';

  public fullName = 'Kadabra BS';

  public cardType = CardType.PSYCHIC;

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Abra';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public hp = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Recover',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      text: 'Discard 1 [P] Energy attached to Kadabra in order to use this attack. Remove all damage counters from Kadabra.',
      damage: 0
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, P);

      const player = effect.player;

      const healEffect = new HealEffect(player, player.active, player.active.damage);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }

}
