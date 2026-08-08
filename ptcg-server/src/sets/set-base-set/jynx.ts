import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Jynx extends PokemonCard {
  public name = 'Jynx';
  public set = 'BS';
  public fullName = 'Jynx BS';

  public stage = Stage.BASIC;
  public cardType = P;

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';

  public hp = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Doubleslap',
      cost: [P],
      damage: 10,
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Meditate',
      cost: [P, P, C],
      damage: 20,
      text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = heads * 10;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damage = opponent.active.damage + 20;
      effect.damage = damage;
    }

    return state;
  }
}
