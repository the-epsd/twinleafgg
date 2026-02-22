import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { GameError, GameMessage } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Reuniclus extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Duosion';

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Summoning Gate',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Look at the top 8 cards of your deck and put any number of Pokémon you find there onto your Bench. Shuffle the other cards into your deck.'
    },
    {
      name: 'Brain Shake',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 100,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '72';

  public name: string = 'Reuniclus';

  public fullName: string = 'Reuniclus TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Legacy implementation:
      // - Moved top 8 into a temporary CardList.
      // - Prompted for any number of Pokémon to bench (up to open bench slots).
      // - Shuffled remaining cards back into deck.
      //
      // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON).
      return LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON(
        store,
        state,
        player,
        8,
        openSlots.length,
        { remainderDestination: 'shuffle' }
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
