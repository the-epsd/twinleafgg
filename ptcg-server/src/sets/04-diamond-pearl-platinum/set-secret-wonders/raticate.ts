import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rattata';
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [];

  public attacks = [{
    name: 'Gnaw Off',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 60 more damage.'
  },
  {
    name: 'Sneaky Attack',
    cost: [C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Raticate has any Darkness Energy attached to it, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Raticate';
  public fullName: string = 'Raticate SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gnaw Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 60);
    }

    // Sneaky Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      const hasDarkness = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.DARK) || em.provides.includes(CardType.ANY)
      );
      if (hasDarkness) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
