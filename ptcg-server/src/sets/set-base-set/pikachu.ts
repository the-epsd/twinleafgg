
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Pikachu extends PokemonCard {
  public name = 'Pikachu';
  public cardImage: string = 'assets/cardback.png';
  public set = 'BS';
  public setNumber = '58';

  public cardType: CardType[] = [L];

  public fullName = 'Pikachu BS';

  public stage = Stage.BASIC;

  public evolvesInto = ['Raichu', 'Alolan Raichu', 'Raichu-GX', 'Dark Raichu', 'Raichu ex'];

  public hp = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Gnaw',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Thunder Jolt',
      cost: [L, C],
      damage: 30,
      text: 'Flip a coin. If tails, Pikachu does 10 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (!heads) {
          const damage = new DealDamageEffect(effect, 10);
          damage.target = effect.player.active;
          store.reduceEffect(state, damage);
        }
      });
    }
    return state;
  }

}
