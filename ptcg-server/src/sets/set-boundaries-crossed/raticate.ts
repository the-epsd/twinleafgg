import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { MOVE_CARD_TO, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rattata';
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Gnaw Through',
    cost: [C],
    damage: 0,
    text: 'Discard a Pokémon Tool card attached to the Defending Pokémon.'
  },
  {
    name: 'Super Fang',
    cost: [C, C, C],
    damage: 0,
    text: 'Put damage counters on the Defending Pokémon until its remaining HP is 10.'
  }];

  public set: string = 'BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Raticate';
  public fullName: string = 'Raticate BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.tool !== undefined) {
        MOVE_CARD_TO(state, opponent.active.tool, opponent.discard);
        opponent.active.tool = undefined;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const selectedTarget = opponent.active;
      const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
      store.reduceEffect(state, checkHpEffect);

      const totalHp = checkHpEffect.hp;
      let damageAmount = totalHp - 10;

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

    return state;
  }
}