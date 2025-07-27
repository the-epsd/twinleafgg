import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nickit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Filch',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Tail Smack',
    cost: [D, C],
    damage: 30,
    text: ''
  }];

  public set = 'CPA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name = 'Nickit';
  public fullName = 'Nickit CPA';
  public regulationMark = 'D';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }

}