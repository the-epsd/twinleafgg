import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Dratini2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 40;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hypnotic Gaze',
      cost: [G],
      damage: 0,
      text: 'The Defending Pok\u00e9mon is now Asleep.'
    },
    {
      name: 'Tail Whap',
      cost: [L],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini DRV 2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
