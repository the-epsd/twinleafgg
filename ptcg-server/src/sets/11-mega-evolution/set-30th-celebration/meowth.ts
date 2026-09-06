import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Pay Day',
    cost: [C, C],
    damage: 30,
    text: 'Draw a card.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Meowth';
  public fullName: string = 'Meowth 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pay Day
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    return state;
  }
}
