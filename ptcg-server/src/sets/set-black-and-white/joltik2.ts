import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Joltik2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Leech Life',
      cost: [L],
      damage: 10,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik BLW 45';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leech Life - heal same amount as damage dealt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healEffect = new HealTargetEffect(effect, effect.damage);
      healEffect.target = effect.player.active;
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
