
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../game/store/prefabs/effect-of-attack-prefabs';
export class Sandshrew extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp = 40;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -30 }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Sand-attack',
      cost: [F],
      damage: 10,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    }
  ];

  public set = 'BS';
  public setNumber = '62';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Sandshrew';
  public fullName = 'Sandshrew BS';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }

}
