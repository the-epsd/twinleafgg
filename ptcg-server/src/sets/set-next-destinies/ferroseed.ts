import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Ferroseed extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Self Destruct',
      cost: [M, C],
      damage: 60,
      text: 'This Pokémon does 60 damage to itself.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ferroseed';
  public fullName: string = 'Ferroseed NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Self Destruct
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 60);
    }

    return state;
  }
}
