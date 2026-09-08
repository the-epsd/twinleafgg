import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Scolipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Whirlipede';
  public hp: number = 170;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Dastardly Jab',
    cost: [D, C],
    damage: 0,
    text: 'Put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10.'
  },
  {
    name: 'Sludge Bomb',
    cost: [D, C, C],
    damage: 160,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Scolipede';
  public fullName: string = 'Scolipede TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dastardly Jab
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHp);
      const totalHp = checkHp.hp;
      const damageNeeded = totalHp - opponent.active.damage - 10;
      if (damageNeeded > 0) {
        const damageEffect = new PutCountersEffect(effect, damageNeeded);
        damageEffect.target = opponent.active;
        store.reduceEffect(state, damageEffect);
      }
    }

    return state;
  }
}
