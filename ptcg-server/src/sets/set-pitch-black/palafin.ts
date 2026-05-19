import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Palafin extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Finizen';
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Justice Knuckle',
    cost: [W, W],
    damage: 80,
    damageCalculation: '+',
    text: 'If your opponent has 1 Prize card remaining, this attack does 200 more damage.',
  }];

  public set: string = 'M5';
  public setNumber: string = '21';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Palafin';
  public fullName: string = 'Palafin M5';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.getPrizeLeft() === 1) {
        effect.damage += 200;
      }
    }
    return state;
  }
}
