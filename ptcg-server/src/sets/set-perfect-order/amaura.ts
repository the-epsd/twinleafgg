import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Amaura extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Antique Sail Fossil';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Icy Wind',
    cost: [W, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokemon is now Asleep.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Amaura';
  public fullName: string = 'Amaura M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
}
