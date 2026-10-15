import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Beautifly extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Silcoon';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Whirlwind',
    cost: [C, C],
    damage: 30,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Giga Drain',
    cost: [G, G, C, C],
    damage: 50,
    text: 'After your attack, remove from Beautifly the number of damage counters equal to the damage you did to the Defending Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Beautifly';
  public fullName: string = 'Beautifly DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Whirlwind
    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    // Giga Drain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const healEffect = new HealEffect(player, player.active, effect.damage);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
