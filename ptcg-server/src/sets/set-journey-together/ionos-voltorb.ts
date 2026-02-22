import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IonosVoltorb extends PokemonCard {

  public tags = [CardTag.IONOS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 70;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Voltaic Chain',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each [L] Energy attached to all of your Iono\'s Pokémon.'
    }
  ];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'JTG';

  public setNumber = '47';

  public name: string = 'Iono\'s Voltorb';

  public fullName: string = 'Iono\'s Voltorb JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.IONOS)) {
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergyEffect);
          checkProvidedEnergyEffect.energyMap.forEach(energy => {
            if (energy.provides.includes(CardType.LIGHTNING) || energy.provides.includes(CardType.ANY)) {
              energies++;
            }
          });
        }
      });

      effect.damage += energies * 20;
    }

    return state;
  }

}