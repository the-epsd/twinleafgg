import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Gigalith extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Boldore';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Power Gem',
      cost: [F, C, C],
      damage: 60,
      text: 'Does 10 damage to each of your opponent\'s Benched Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gigalith';
  public fullName: string = 'Gigalith NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Gem - 60 damage + bench spread based on energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count energy attached to this Pokémon
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      let energyCount = 0;
      checkEnergy.energyMap.forEach(em => {
        energyCount += 1;
      });

      // Damage each benched Pokémon for 10 x energy count
      const benchDamage = 10 * energyCount;
      if (benchDamage > 0) {
        opponent.bench.forEach(benchSlot => {
          if (benchSlot.cards.length > 0) {
            const damageEffect = new PutDamageEffect(effect, benchDamage);
            damageEffect.target = benchSlot;
            store.reduceEffect(state, damageEffect);
          }
        });
      }
    }

    return state;
  }
}
