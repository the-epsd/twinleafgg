import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Karrablast extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 60;

  public weakness = [{ type: R }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Beat',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Reckless Charge',
      cost: [C, C, C],
      damage: 40,
      text: 'This Pokémon does 10 damage to itself.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '9';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Karrablast';

  public fullName: string = 'Karrablast DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }

}
