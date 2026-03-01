import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Lampent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Litwick';
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Live Coal',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Searing Flame',
      cost: [R, C, C],
      damage: 40,
      text: 'The Defending Pokémon is now Burned.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lampent';
  public fullName: string = 'Lampent PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
