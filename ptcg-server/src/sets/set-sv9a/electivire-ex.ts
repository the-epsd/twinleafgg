import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';

export class Electivireex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'I';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Electabuzz';
  public cardType: CardType = L;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    {
      name: 'Dual Bolt',
      cost: [L, C],
      damage: 0,
      text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'High Voltage Press',
      cost: [L, L, C],
      damage: 180,
      damageCalculation: '+',
      text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 100 more damage.'
    },
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Electivire ex';
  public fullName: string = 'Electivire ex SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dual Bolt
    if (WAS_ATTACK_USED(effect, 0, this)){
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state, 2, 2);
    }

    // High Voltage Press
    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;

      const extraEffectCost: CardType[] = [L, L, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost){ effect.damage += 100; }
    }
    
    return state;
  }
}