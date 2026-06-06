import {
  CardType,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianMrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat: CardType[] = [C];

  public attacks = [
    {
      name: 'Reflect',
      cost: [C],
      damage: 0,
      text: "During your opponent's next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).",
    },
    { name: 'Icy Snow', cost: [C, C], damage: 30, text: '' },
  ];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Galarian Mr. Mime';
  public fullName: string = 'Galarian Mr. Mime DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
