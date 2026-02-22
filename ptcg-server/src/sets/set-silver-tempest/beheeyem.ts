import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beheeyem extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Elgyem';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psychic Sphere',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: ''
    },
    {
      name: 'Psychic Arrow',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name: string = 'Beheeyem';

  public fullName: string = 'Beheeyem PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state, 1, 1, true, [SlotType.BENCH, SlotType.ACTIVE]);
    }
    return state;
  }
}
