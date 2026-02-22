import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, EnergyType, CardTag } from '../../game';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wishiwashi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.RAPID_STRIKE];

  public cardType: CardType = CardType.WATER;

  public hp: number = 30;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Group Power',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has 3 or more [W] Energy attached, it gets +150 HP.'
  }
  ];

  public attacks = [
    {
      name: 'Schooling Shot',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 more damage for each basic Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Wishiwashi';

  public fullName: string = 'Wishiwashi EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const player = effect.player;

      const targetPokemonCard = effect.target.getPokemonCard();
      if (IS_ABILITY_BLOCKED(store, state, player, this) || targetPokemonCard !== this) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;

      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });

      if (energyCount >= 3) {
        effect.hp += 150;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        if (em.card.energyType === EnergyType.BASIC) {
          energyCount += em.provides.length;
        }
      });

      effect.damage += energyCount * 30;
    }

    return state;
  }

}
