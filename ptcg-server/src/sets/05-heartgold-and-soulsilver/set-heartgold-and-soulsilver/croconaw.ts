import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
export class Croconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Totodile';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Big Bite',
    cost: [W, C, C],
    damage: 50,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'HS';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }

}