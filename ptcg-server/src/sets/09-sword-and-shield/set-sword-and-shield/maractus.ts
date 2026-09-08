import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Maractus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Zzzt',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Powerful Needles',
    cost: [G, C],
    damage: 60,
    text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage for each heads. '
  }];

  public set: string = 'SSH';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Maractus SSH';
  public name: string = 'Maractus';
  public setNumber: string = '7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount++;
      });

      if (energyCount > 0) {
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
          effect.damage = results.filter(r => r).length * 60;
        });
      } else {
        effect.damage = 0;
      }

    }

    return state;
  }
}