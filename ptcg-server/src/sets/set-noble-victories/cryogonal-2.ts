import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

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
      text: 'The Defending Pokemon is now Asleep.'
    },
    {
      name: 'Ice Chain',
      cost: [W, W, C],
      damage: 50,
      text: 'Switch the Defending Pokemon with 1 of your opponent\'s Benched Pokemon.'
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
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Ice Chain - switch defending Pokemon after attack
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
