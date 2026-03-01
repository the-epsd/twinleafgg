import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Snorunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Powder Snow',
      cost: [W],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Headbutt',
      cost: [W, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snorunt';
  public fullName: string = 'Snorunt PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
