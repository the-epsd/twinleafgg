import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Splash About',
    cost: [W],
    damage: 10,
    damageCalculation: '+',
    text: 'If Buizel has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Buizel';
  public fullName: string = 'Buizel DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Splash About
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap.reduce(
      (left, p) => left + p.provides.length,
      0,
      );
      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap.reduce(
      (left, p) => left + p.provides.length,
      0,
      );
      if (playerEnergyCount < opponentEnergyCount) {
      effect.damage += 10;
      }
    }

    return state;
  }
}
