import { PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slugma extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = R;
  public hp = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Magma Ring',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Flare',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Slugma';
  public fullName: string = 'Slugma CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}