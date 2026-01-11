import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lugia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Aero Ball',
    cost: [C, C],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each Energy attached to both Active Pokémon.'
  },
  {
    name: 'Deep Crush',
    cost: [C, C, C, C],
    damage: 160,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'D';
  public set: string = 'CEL';
  public name: string = 'Lugia';
  public fullName: string = 'Lugia CEL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += (playerEnergyCount + opponentEnergyCount) * 20;
    }

    // Deep Crush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}