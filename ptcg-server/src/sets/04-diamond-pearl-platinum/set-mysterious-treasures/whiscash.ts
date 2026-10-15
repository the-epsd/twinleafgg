import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Whiscash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Barboach';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Fury',
    cost: [W, C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the number of damage counters on Whiscash.'
  },
  {
    name: 'Magnitude',
    cost: [F, C, C, C],
    damage: 60,
    text: 'Does 20 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Whiscash';
  public fullName: string = 'Whiscash MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fury
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const damageCounters = effect.player.active.damage / 10;
      effect.damage = 20 * damageCounters;
    }

    // Magnitude
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
