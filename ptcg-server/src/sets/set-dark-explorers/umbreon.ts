import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Shadow Drain',
      cost: [C, C],
      damage: 30,
      text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
    },
    {
      name: 'Slashing Strike',
      cost: [D, C, C],
      damage: 80,
      text: 'This Pokémon can\'t use Slashing Strike during your next turn.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shadow Drain - heal same amount as damage dealt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healEffect = new HealTargetEffect(effect, effect.damage);
      healEffect.target = effect.player.active;
      store.reduceEffect(state, healEffect);
    }

    // Slashing Strike - can't use this attack next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
      }
    }

    return state;
  }
}
