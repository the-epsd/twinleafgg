import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';

import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NecrozmaV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Prismatic Ray',
      cost: [CardType.PSYCHIC],
      damage: 20,
      text: 'This attack also does 20 damage to 2 of your opponent\'s ' +
        'Benched Pokémon. (Don\'t apply Weakness and Resistance ' +
        'for Benched Pokémon.) '
    },
    {
      name: 'Special Laser',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If this Pokémon has any Special Energy attached, this ' +
        'attack does 120 more damage. '
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Necrozma V';

  public fullName: string = 'Necrozma V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state, 2, 2);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let hasSpecialEnergy: boolean = false;
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard.superType === SuperType.ENERGY && energyCard.energyType === EnergyType.SPECIAL) {
          hasSpecialEnergy = true;
        }
      });

      if (hasSpecialEnergy) {
        effect.damage += 120;
      }

    }
    return state;
  }
}