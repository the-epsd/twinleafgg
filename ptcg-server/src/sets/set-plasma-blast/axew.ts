import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 50;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Strong Bond',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Supporter card named Iris, reveal it, and put it into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Dragon Claw',
      cost: [F, M],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Axew';
  public fullName: string = 'Axew PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
        { name: 'Iris' },
        { min: 0, max: 1, allowCancel: false }
      );
    }

    return state;
  }
}
