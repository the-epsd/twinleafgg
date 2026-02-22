import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MarniesMorpeko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Spiky Wheel',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 40 more damage for each [D] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '137';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Morpeko';
  public fullName: string = 'Marnie\'s Morpeko DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.DARK || cardType === CardType.ANY
        ).length;
      });

      effect.damage += energyCount * 40;
    }
    return state;
  }
}