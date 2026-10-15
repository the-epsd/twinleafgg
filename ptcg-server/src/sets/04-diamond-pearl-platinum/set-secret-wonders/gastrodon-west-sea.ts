import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GastrodonWestSea extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shellos West Sea';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Raging Flood',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each damage counter on Gastrodon West Sea. Then, remove 2 damage counters from Gastrodon West Sea.'
  },
  {
    name: 'Wild Waves',
    cost: [F, C, C, C],
    damage: 80,
    text: 'Put 1 damage counter on each Benched Pokémon (both yours and your opponent\'s).'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Gastrodon West Sea';
  public fullName: string = 'Gastrodon West Sea SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Raging Flood
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const damageCounters = effect.player.active.damage / 10;
      effect.damage += 10 * damageCounters;
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    // Wild Waves
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutCountersEffect(effect, 10);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutCountersEffect(effect, 10);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
