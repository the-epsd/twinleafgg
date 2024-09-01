import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Monferno extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Chimchar';

  public regulationMark: string = 'H';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Chop',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 40,
    text: 'Discard an Energy from this Pokémon.'
  },
  {
    name: 'Heat Blow',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 80,
    text: 'Discard an Energy from this Pokémon.'
  }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Monferno';

  public fullName: string = 'Monferno TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
    }
    return state;
  }
}