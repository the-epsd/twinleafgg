import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trubbish';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Gentle Wrap',
      cost: [P, C],
      damage: 30,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Sludge Toss',
      cost: [P, C, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gentle Wrap - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }
    // Sludge Toss - poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, addSpecialCondition);
    }

    return state;
  }
}
