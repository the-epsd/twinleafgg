import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../game/store/prefabs/prefabs';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Weepinbell';
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Panic Vine',
    cost: [G],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Confused. During your opponent\'s next turn, that Pokémon can\'t retreat.'
  },
  {
    name: 'Solar Beam',
    cost: [G, C, C],
    damage: 120,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Victreebel';
  public fullName: string = 'Victreebel BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}