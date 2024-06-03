import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Charmeleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Slash',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: '',
    },
    {
      name: 'Flamethrower',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 50,
      text: 'Discard 1 R Energy card attached to Charmeleon in order to use this attack.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
      }
    },
  ];

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
    }
    return state;
  }

}