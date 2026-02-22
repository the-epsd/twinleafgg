import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Joltik extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Leech Life',
      cost: [L],
      damage: 10,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'TEU';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leech Life
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healTime = new HealTargetEffect(effect, effect.damage);
      healTime.target = effect.player.active;
      store.reduceEffect(state, healTime);
    }
    return state;
  }
} 
