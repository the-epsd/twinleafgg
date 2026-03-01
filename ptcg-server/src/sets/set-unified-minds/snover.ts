import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Powder Snow',
      cost: [W],
      damage: 10,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snover';
  public fullName: string = 'Snover UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Powder Snow
    // Ref: AGENTS-patterns.md (Asleep status)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
