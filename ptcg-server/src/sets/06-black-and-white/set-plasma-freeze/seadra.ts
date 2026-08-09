import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [W],
      damage: 20,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra PLF';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
