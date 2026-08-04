import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tinkaton extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Tinkatuff';
  public hp: number = 160;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Windup Swing',
    cost: [M],
    damage: 240,
    damageCalculation: '-',
    text: 'This attack does 60 less damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Tinkaton';
  public fullName: string = 'Tinkaton MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Windup Swing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);
      const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      effect.damage = Math.max(0, effect.damage - (60 * totalEnergy));
    }

    return state;
  }
}
