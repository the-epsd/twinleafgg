import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { StateUtils } from '../../../game/store/state-utils';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Cobalion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Press',
    cost: [M, C],
    damage: 20,
    text: 'Does 20 more damage for each Energy attached to the Defending Pokemon.'
  },
  {
    name: 'Iron Breaker',
    cost: [M, M, C],
    damage: 80,
    text: 'The Defending Pokemon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'LTR';
  public name: string = 'Cobalion';
  public fullName: string = 'Cobalion LTR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += energyCount * 20;
    }

    // Iron Breaker
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
