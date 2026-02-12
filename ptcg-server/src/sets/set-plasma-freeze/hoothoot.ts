import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Hoothoot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Dual Draw',
      cost: [C],
      damage: 0,
      text: 'Each player draws 2 cards.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '91';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hoothoot';
  public fullName: string = 'Hoothoot PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      DRAW_CARDS(player, 2);
      DRAW_CARDS(opponent, 2);
    }

    return state;
  }
}
