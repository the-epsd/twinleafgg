import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { OPPONENT_CANNOT_PLAY_ITEM_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Luxio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shinx';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disconnect',
    cost: [C],
    damage: 30,
    text: 'Your opponent can\'t play any Item cards from their hand during their next turn.',
  }];

  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Luxio';
  public fullName: string = 'Luxio UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disconnect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    return state;
  }
}