import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Flaaffy extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mareep';
  public hp: number = 90;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Disconnect',
    cost: [L, C],
    damage: 40,
    text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Flaaffy';
  public fullName: string = 'Flaaffy M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disconnect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }
    return state;
  }
}
