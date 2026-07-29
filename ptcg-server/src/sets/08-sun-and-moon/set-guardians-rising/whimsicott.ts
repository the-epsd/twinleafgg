import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  TAKE_MORE_PRIZES_IF_DEFENDING_KNOCKED_OUT_DURING_YOUR_NEXT_TURN,
} from '../../../game/store/prefabs/prefabs';

export class Whimsicott extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cottonee';
  public cardType: CardType = Y;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'The Wages of Fluff',
      cost: [C],
      damage: 0,
      text: 'If the Defending Pokémon is Knocked Out during your next turn, take 2 more Prize cards.'
    },
    {
      name: 'Fairy Wind',
      cost: [Y],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'GRI';
  public setNumber: string = '91';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Whimsicott';
  public fullName: string = 'Whimsicott GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return TAKE_MORE_PRIZES_IF_DEFENDING_KNOCKED_OUT_DURING_YOUR_NEXT_TURN(store, state, effect, this, 2);
    }

    return state;
  }
}
