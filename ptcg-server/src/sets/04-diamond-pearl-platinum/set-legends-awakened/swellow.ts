import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { MOVED_TO_ACTIVE_THIS_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Taillow';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Big Wing',
    powerType: PowerType.POKEBODY,
    text: 'If Swellow has no Energy attached to it, Swellow\'s Retreat Cost is 0.'
  }];

  public attacks = [{
    name: 'Mach Descent',
    cost: [C, C],
    damage: 30,
    text: 'If Swellow was on your Bench this turn, this attack\'s base damage is 60 instead of 30.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Swellow';
  public fullName: string = 'Swellow LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Wing
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      if (checkEnergy.energyMap.length === 0) {
        effect.cost = [];
      }
    }

    // Mach Descent
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage = 60;
      }
    }

    return state;
  }
}
