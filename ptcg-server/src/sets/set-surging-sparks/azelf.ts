import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Azelf extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 70;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [{
    name: 'Neurokenesis',
    cost: [P, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on your opponent\'s Pokémon.'
  }];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public setNumber: string = '80';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Azelf';

  public fullName: string = 'Azelf SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let totalDamage = 0;

      // Check active Pokémon
      totalDamage += opponent.active.damage;

      // Check bench Pokémon
      opponent.bench.forEach(benchPokemon => {
        totalDamage += benchPokemon.damage;
      });

      effect.damage = totalDamage + 10;
    }
    return state;
  }
}