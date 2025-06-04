import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class SamiyasMantyke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Sport',
    cost: [W],
    damage: 10,
    damageCalculation: '+',
    text: 'If Samiya\'s Mantyke has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage.'
  },
  {
    name: 'Splash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'Samiya\'s Mantyke';
  public fullName: string = 'Samiya\'s Mantyke PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      if (playerEnergyCount < opponentEnergyCount) {
        effect.damage += 10;
      }
    }

    return state;
  }

}
