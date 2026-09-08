import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class HisuianZoroark extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hisuian Zorua';
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Swirling Resentment',
    cost: [C, C, C],
    damage: 0,
    text: 'Place damage counters on your opponent\'s Active Pokémon until its remaining HP is 50.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Hisuian Zoroark';
  public fullName: string = 'Hisuian Zoroark 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scratch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      let damageAmount = checkHpEffect.hp - 50;
      const targetDamage = selectedTarget.damage;
      if (targetDamage > 0) {
        damageAmount = Math.max(0, damageAmount - targetDamage);
      }

      if (damageAmount > 0) {
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      }
    }

    return state;
  }
}
