import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Slowpoke extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Big Yawn',
      cost: [C],
      damage: 0,
      text: 'Both this Pokémon and the Defending Pokémon are now Asleep.'
    },
    {
      name: 'Shot in the Dark',
      cost: [W, C],
      damage: 20,
      text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Yawn - both Pokémon fall asleep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Put both this Pokémon and the Defending Pokémon to sleep
      const selfAsleep = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      selfAsleep.target = player.active;
      store.reduceEffect(state, selfAsleep);

      const opponentAsleep = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      opponentAsleep.target = opponent.active;
      store.reduceEffect(state, opponentAsleep);
    }

    // Shot in the Dark - flip 2 coins, need both heads
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        // If either coin is tails, the attack does nothing
        if (results.includes(false)) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
