import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 80;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Psychic',
    cost: [P, P, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'N2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon N2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += energyCount * 10;
    }

    return state;
  }
}
