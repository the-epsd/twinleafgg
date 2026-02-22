import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MVenusaurEX extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA,];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Venusaur-EX';
  public cardType: CardType = G;
  public hp: number = 230;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Crisis Vine',
    cost: [G, G, G, C],
    damage: 120,
    text: 'Your opponent\'s Active Pokémon is now Paralyzed and Poisoned.'
  }];

  public set: string = 'XY';
  public name: string = 'M Venusaur-EX';
  public fullName: string = 'M Venusaur-EX XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // wow i hate the rules
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Venusaur Spirit Link') {
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED, SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}