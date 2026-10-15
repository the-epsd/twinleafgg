import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Mismagius extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Misdreavus';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: 20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Avenge',
    cost: [P],
    damage: 0,
    text: 'Count the number of your Pokémon that have any damage counters on them. Put that many damage counters on the Defending Pokémon.'
  },
  {
    name: 'Psywave',
    cost: [P, P, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 20 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Mismagius';
  public fullName: string = 'Mismagius DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Avenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let damagedCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.damage > 0) {
          damagedCount += 1;
        }
      });
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(damagedCount, store, state, effect);
    }

    // Psywave
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkProvidedEnergy);
      effect.damage += checkProvidedEnergy.energyMap.length * 20;
    }

    return state;
  }
}
