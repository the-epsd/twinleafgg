import { State, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Salazzle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Salandit';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Nasty Plot',
    cost: [P],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Severe Poison',
    cost: [P],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Salazzle';
  public fullName: string = 'Salazzle CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, {}, { min: 0, max: 2 });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 40;
      store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}