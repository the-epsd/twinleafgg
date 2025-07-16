import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_PRIZES, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hawlucha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Prize Count',
    cost: [F, F],
    damage: 50,
    damageCalculation: '+',
    text: 'If you have more Prize cards remaining than your opponent, this attack does 90 more damage.'
  }];

  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Hawlucha';
  public fullName: string = 'Hawlucha TWM';
  public regulationMark: string = 'H';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (GET_PLAYER_PRIZES(effect.player) > GET_PLAYER_PRIZES(StateUtils.getOpponent(state, effect.player))) {
        effect.damage += 90;
      }
    }

    return state;
  }
}