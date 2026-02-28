import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Cryogonal2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [W],
      damage: 10,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Ice Chain',
      cost: [W, W, C],
      damage: 50,
      text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cryogonal';
  public fullName: string = 'Cryogonal NVI 33';

  private usedIceChain: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Icy Wind
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Ice Chain - switch defending Pokémon after attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedIceChain = true;
    }

    // After Ice Chain, switch opponent's active with benched
    if (effect instanceof AfterAttackEffect && this.usedIceChain) {
      this.usedIceChain = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect && this.usedIceChain) {
      this.usedIceChain = false;
    }

    return state;
  }
}
