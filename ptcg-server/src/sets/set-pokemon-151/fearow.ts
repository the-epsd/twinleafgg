import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Fearow extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spearow';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Beak Catch',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.',
    },
    { name: 'Speed Dive', cost: [C], damage: 50, text: '' }
  ];

  public set: string = 'MEW';
  public name: string = 'Fearow';
  public fullName: string = 'Fearow MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this))
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, 0, 3);

    return state;
  }
}