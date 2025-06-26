import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { PowerType } from '../../game';

export class Hoppip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 30;
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Cottonweed',
    powerType: PowerType.POKEBODY,
    text: 'If Hoppip has any [G] Energy attached to it, the Retreat Cost for Hoppip is 0.'
  }];

  public attacks = [{
    name: 'Hover Heal',
    cost: [G],
    damage: 10,
    text: 'Remove all Special Conditions from Hoppip.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Hoppip';
  public fullName: string = 'Hoppip SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasGrassEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.GRASS) || energy.provides.includes(CardType.ANY)
      );

      if (hasGrassEnergy) {
        effect.cost = [];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const conditions = effect.target.specialConditions.slice();
      conditions.forEach((condition: string) => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    return state;
  }

}