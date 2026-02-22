import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HisuianBasculegion extends PokemonCard {
  public regulationMark = 'F';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 120;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Hisuian Basculin';

  public attacks = [{
    name: 'Grudge Dive',
    cost: [CardType.WATER],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Jet Headbutt',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Hisuian Basculegion';
  public fullName: string = 'Hisuian Basculegion ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 90;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
        store.reduceEffect(state, specialConditionEffect);
      }

      return state;
    }

    return state;
  }
}