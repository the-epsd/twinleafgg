import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Kadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Abra';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Psychic',
    cost: [ P ],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.',
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Kadabra';
  public fullName: string = 'Kadabra TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 30;
    }

    return state;
  }
}