import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 50;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: '',
    },
    {
      name: 'Ember',
      cost: [ CardType.FIRE, CardType.COLORLESS ],
      damage: 40,
      text: 'Discard 1 R Energy card attached to Charmander in order to use this attack.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
      }
    },
  ];

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
    }
    return state;
  }

}