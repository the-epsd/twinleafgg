import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Gulpin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Drool',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Super Poison Breath',
    cost: [D, D, C],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'SCR';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Gulpin';
  public fullName: string = 'Gulpin SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}