import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electrike extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [L],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Tackle',
    cost: [L, L],
    damage: 30,
    text: ''
  }];

  public set: string = 'M5';
  public setNumber: string = '22';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike M5';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }
    return state;
  }
}
