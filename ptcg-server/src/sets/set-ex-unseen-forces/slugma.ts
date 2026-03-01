import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Slugma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Yawn',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'UF';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fishing Tail
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
