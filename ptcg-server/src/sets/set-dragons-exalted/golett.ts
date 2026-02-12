import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Golett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Nap',
      cost: [C, C],
      damage: 0,
      text: 'Heal 40 damage from this Pokémon.'
    },
    {
      name: 'Pound',
      cost: [P, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golett';
  public fullName: string = 'Golett DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
    }

    return state;
  }
}
