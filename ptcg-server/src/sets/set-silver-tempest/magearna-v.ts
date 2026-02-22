import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MagearnaV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 210;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gear Throw',
    cost: [M],
    damage: 0,
    text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Special Laser',
    cost: [M, M, C],
    damage: 100,
    text: 'If this Pokémon has any Special Energy attached, this attack does 120 more damage.'
  }];

  public set: string = 'SIT';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Magearna V';
  public fullName: string = 'Magearna V SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
        const energyCard = em.card;
        return energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL;
      });

      if (hasSpecialEnergy) {
        effect.damage += 120;
      }
    }

    return state;
  }
}