import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class PokeParksTorchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Flamethrower',
    cost: [R, C, C],
    damage: 40,
    text: 'Discard a [R] Energy attached to this Pokémon.'
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Torchic';
  public fullName: string = 'PokéPark\'s Torchic PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }

}
