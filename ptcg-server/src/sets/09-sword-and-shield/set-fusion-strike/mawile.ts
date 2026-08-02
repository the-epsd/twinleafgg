import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { increaseDefendingPokemonAttackCostNextTurnEffect, increaseDefendingPokemonRetreatCostNextTurnEffect } from '../../../game/store/effects/effect-of-attack-effects';

export class Mawile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];


  public attacks = [{
    name: 'Chomp Chomp Hold',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks cost Colorless more, and its Retreat Cost is Colorless more.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mawile';
  public fullName: string = 'Mawile FST 119';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chomp Chomp Hold
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = store.reduceEffect(state, increaseDefendingPokemonAttackCostNextTurnEffect(effect));
      state = store.reduceEffect(state, increaseDefendingPokemonRetreatCostNextTurnEffect(effect));
    }

    return state;
  }
}
