import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {

  public regulationMark = 'E';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pay Day',
      cost: [C],
      damage: 10,
      text: 'Draw a card.',
    }
  ];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '199';
  public name: string = 'Meowth';
  public fullName: string = 'Meowth FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }
}
