import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Bulbasaur extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bind Down',
    cost: [G],
    damage: 10,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur M1L';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
} 