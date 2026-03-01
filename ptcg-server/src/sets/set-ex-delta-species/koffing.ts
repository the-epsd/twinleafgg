import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Koffing extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Confusion Gas',
    cost: [G],
    damage: 0,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set = 'DS';
  public setNumber = '72';
  public cardImage = 'assets/cardback.png';
  public name = 'Koffing';
  public fullName = 'Koffing DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}