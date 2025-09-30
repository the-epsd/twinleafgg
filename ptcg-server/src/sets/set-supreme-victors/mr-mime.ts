import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public retreat = [C];

  public powers = [{
    name: 'Focus Wall',
    powerType: PowerType.POKEBODY,
    text: 'If Mr. Mime would be Knocked Out by damage from an attack that does 70 or more damage (after applying Weakness and Resistance), Mr. Mime is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [{
    name: 'Desperate Slap',
    cost: [P, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Mr. Mime already has 5 or more damage counters on it, this attack does 20 damage plus 40 more damage.'
  }];

  public set: string = 'SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Mr. Mime';
  public fullName: string = 'Mr. Mime SV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.damage >= 70) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= checkHpEffect.hp) {

        if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
          return state;
        }

        effect.surviveOnTenHPReason = this.powers[0].name;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.damage >= 50) {
        effect.damage += 40;
      }
    }

    return state;
  }
}