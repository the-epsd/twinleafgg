import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Blastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Wartortle';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Deluge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), you may attach a [W] Energy card from your hand to 1 of your Pokémon.'
  }];

  public attacks = [
    {
      name: 'Hydro Pump',
      cost: [C, C, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'BCR';
  public setNumber: string = '31';
  public name: string = 'Blastoise';
  public fullName: string = 'Blastoise BCR';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 10;
      return state;
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      /*
       * Legacy pre-prefab implementation:
       * - manually checked for basic Water Energy in hand
       * - opened AttachEnergyPrompt against hand -> Active/Bench
       * - resolved transfer targets with StateUtils.getTarget
       * - attached cards with AttachEnergyEffect
       */
      // Converted to prefab version (AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND).
      return AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND(
        store,
        state,
        player,
        CardType.WATER
      );
    }

    return state;
  }

}
