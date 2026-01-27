import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Emolga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bounce',
      cost: [L, C],
      damage: 30,
      text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Emolga';
  public fullName: string = 'Emolga NXD';

  private usedBounce: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bounce - set flag
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedBounce = true;
    }

    // After attack, switch self with benched
    if (effect instanceof AfterAttackEffect && this.usedBounce) {
      this.usedBounce = false;
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect && this.usedBounce) {
      this.usedBounce = false;
    }

    return state;
  }
}
