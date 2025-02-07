import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';


export class EthansCyndaquil extends PokemonCard {

  public tags = [CardTag.ETHANS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 70;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Ember',
      cost: [R],
      damage: 30,
      text: 'Discard an Energy from this Pokémon.',
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Ethan\'s Cyndaquil';

  public fullName: string = 'Ethan\'s Cyndaquil SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
    }
    return state;
  }

}