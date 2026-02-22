import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: R }];

  public retreat = [CardType.COLORLESS];

  public evolvesFrom = 'Oddish';

  public attacks = [{
    name: 'Poisonpowder',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Foul Odor',
    cost: [CardType.GRASS, CardType.GRASS],
    damage: 20,
    text: 'Both the Defending Pokémon and Gloom are now Confused (after doing damage).'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '37';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.addSpecialCondition(SpecialCondition.CONFUSED);
      opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    return state;
  }
}