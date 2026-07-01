import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { } from '../../game/store/prefabs/prefabs';

export class Diglett extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud Slap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Sand Pit',
    cost: [F, C],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Diglett';
  public fullName: string = 'Diglett CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}
