import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../../game/store/prefabs/prefabs';

export class Sandygast extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'F';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Corner',
    cost: [F],
    damage: 10,
    text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Sandygast';
  public fullName: string = 'Sandygast SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}