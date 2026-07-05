import { State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';

import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class HisuianZorua extends PokemonCard {
  public regulationMark = 'F';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Collect',
      cost: [],
      damage: 0,
      text: 'Draw a card.',
    },
    {
      name: 'Mumble',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: '',
    },
  ];
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Hisuian Zorua';
  public fullName: string = 'Hisuian Zorua LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
      return state;
    }

    return state;
  }
}
