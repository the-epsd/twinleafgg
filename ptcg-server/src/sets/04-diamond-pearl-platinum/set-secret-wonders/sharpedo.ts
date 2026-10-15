import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Sharpedo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Carvanha';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Rough Skin',
    powerType: PowerType.POKEBODY,
    text: 'If Sharpedo is your Active Pokémon and is damaged by an opponent\'s attack (even if Sharpedo is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Strike Wound',
    cost: [W, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If the Defending Pokémon has 2 or more damage counters on it, this attack does 60 damage plus 20 more damage. This attack damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Sharpedo';
  public fullName: string = 'Sharpedo SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rough Skin
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);

      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const placeCounters = new PlaceDamageCountersEffect(
        abilityOwner,
        effect.source,
        20,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
    }

    // Strike Wound
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      let damage = 60;
      if (opponent.active.damage >= 20) {
        damage += 20;
      }

      effect.damage = 0;
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        afterDamage.target = opponent.active;
        store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }
}
