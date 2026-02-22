import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beldum extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 70;

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dig Claws',
      cost: [CardType.METAL],
      damage: 10,
      text: ''
    },
    {
      name: 'Iron Tackle',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'This Pokémon also does 10 damage to itself.'
    },
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Beldum';

  public fullName: string = 'Beldum TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Legacy implementation:
      // - Created DealDamageEffect for 10 and targeted player.active directly.
      //
      // Converted to prefab version (THIS_POKEMON_DOES_DAMAGE_TO_ITSELF).
      return THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }
    return state;
  }

}
