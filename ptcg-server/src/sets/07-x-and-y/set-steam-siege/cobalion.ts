import { State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN,
  PREVENT_DAMAGE,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Cobalion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Quick Guard',
    cost: [M],
    damage: 0,
    text: 'Prevent all damage done to this Pokémon by attacks from Basic Pokémon during your opponent\'s next turn. This Pokémon can\'t use Quick Guard during your next turn.',
  },
  {
    name: 'Revenge Blast',
    cost: [M, M],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Prize card your opponent has taken.',
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Cobalion';
  public fullName: string = 'Cobalion STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
      effect.player.active.cannotUseAttacksNextTurnPending.push('Quick Guard');
    }

    // Revenge Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 30);
    }

    return state;
  }
}
