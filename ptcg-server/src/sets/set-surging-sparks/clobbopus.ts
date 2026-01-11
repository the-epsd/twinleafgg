import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Clobbopus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Slight Intrusion',
      cost: [F],
      damage: 30,
      text: 'This Pokémon also does 10 damage to itself.'
    }
  ];

  public set: string = 'SSP';
  public setNumber = '112';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'H';
  public name: string = 'Clobbopus';
  public fullName: string = 'Clobbopus SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slight Intrusion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
} 