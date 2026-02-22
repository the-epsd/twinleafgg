import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Medichamex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Meditite';

  public cardType = CardType.FIGHTING;

  public hp = 260;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Chi-Atsu',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Put damage counters on your opponent\'s Active Pokémon until its remaining HP is 50.'
    },
    {
      name: 'Yoga Kick',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 190,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public name: string = 'Medicham ex';

  public fullName: string = 'Medicham ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      const totalHp = checkHpEffect.hp;
      let damageAmount = totalHp - 50;

      // Adjust damage if the target already has damage
      const targetDamage = selectedTarget.damage;
      if (targetDamage > 0) {
        damageAmount = Math.max(0, damageAmount - targetDamage);
      }

      if (damageAmount > 0) {
        const damageEffect = new PutCountersEffect(effect, damageAmount);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      } else if (damageAmount <= 0) {
        const damageEffect = new PutCountersEffect(effect, 0);
        damageEffect.target = selectedTarget;
        store.reduceEffect(state, damageEffect);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    return state;
  }
}