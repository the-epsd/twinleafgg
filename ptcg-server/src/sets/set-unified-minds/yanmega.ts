import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Yanmega extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Yanma';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 50,
      text: ''
    },
    {
      name: 'Air Slash',
      cost: [C, C, C],
      damage: 100,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yanmega';
  public fullName: string = 'Yanmega UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Air Slash
    // Ref: set-unbroken-bonds/kyurem.ts (Hail Prison - discard energy)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
