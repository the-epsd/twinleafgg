
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, StateUtils } from '../..';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

import { PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS, PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rabsca extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rellor';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Spherical Shield',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage from and effects of attacks done to your Benched Pokémon by attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Psychic',
    cost: [CardType.GRASS],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Rabsca';

  public fullName: string = 'Rabsca TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 30;
    }

    /*
     * Legacy pre-prefab implementation:
     * - manually intercepted PutDamageEffect / PutCountersEffect
     * - manually checked bench-only targeting and Rabsca-in-play ownership
     * - manually stubbed PowerEffect for ability lock handling
     * - prevented by setting effect.preventDefault = true
     */
    // Converted to prefab version:
    // - PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS
    // - PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS
    state.players.forEach(owner => {
      PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, {
        owner,
        source: this,
        includeSourcePokemon: true
      });
      PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, {
        owner,
        source: this,
        includeSourcePokemon: true
      });
    });
    return state;
  }
}
