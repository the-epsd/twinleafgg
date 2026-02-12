import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Torchic extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 50;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Reckless Charge',
      cost: [R, C],
      damage: 30,
      text: 'This Pokémon does 10 damage to itself.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '14';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Torchic';

  public fullName: string = 'Torchic DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }

}
